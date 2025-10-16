import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const post = await db.blogPost.findUnique({
      where: { slug }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Simple like implementation - in a real app, you'd track which users liked which posts
    await db.blogPost.update({
      where: { id: post.id },
      data: { likeCount: { increment: 1 } }
    })

    return NextResponse.json({ message: 'Post liked successfully' })
  } catch (error) {
    console.error('Error liking blog post:', error)
    return NextResponse.json(
      { error: 'Failed to like blog post' },
      { status: 500 }
    )
  }
}