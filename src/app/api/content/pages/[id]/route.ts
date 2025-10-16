import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/content/pages/[id] - Get single page
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    const page = await db.page.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: page
    })
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page' },
      { status: 500 }
    )
  }
}

// PUT /api/content/pages/[id] - Update page
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      slug,
      content,
      status,
      featuredImage,
      sortOrder
    } = body

    // Check if page exists and user has permission
    const existingPage = await db.page.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true
          }
        }
      }
    })

    if (!existingPage) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to edit pages
    if (session.user.role !== 'admin' && 
        session.user.role !== 'editor' && 
        existingPage.authorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Check if new slug is unique (if changed)
    if (slug && slug !== existingPage.slug) {
      const slugExists = await db.page.findUnique({
        where: { slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Slug already exists' },
          { status: 400 }
        )
      }
    }

    // Update the page
    const updateData: any = {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
      ...(content !== undefined && { content }),
      ...(status !== undefined && { 
        status,
        ...(status === 'published' && !existingPage.publishedAt && { publishedAt: new Date() })
      }),
      ...(featuredImage !== undefined && { featuredImage }),
      ...(sortOrder !== undefined && { sortOrder })
    }

    const updatedPage = await db.page.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedPage,
      message: 'Page updated successfully'
    })
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update page' },
      { status: 500 }
    )
  }
}

// DELETE /api/content/pages/[id] - Delete page
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if page exists and user has permission
    const existingPage = await db.page.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true
          }
        }
      }
    })

    if (!existingPage) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to delete pages
    if (session.user.role !== 'admin' && 
        session.user.role !== 'editor' && 
        existingPage.authorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Delete the page
    await db.page.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete page' },
      { status: 500 }
    )
  }
}