import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import * as fs from 'fs'

// GET /api/maintenance - Get maintenance status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only admins can access maintenance status
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Check if maintenance mode is active
    const maintenanceFile = join(process.cwd(), 'maintenance.json')
    let maintenanceStatus = {
      isActive: false,
      message: '',
      startTime: null,
      endTime: null,
      affectedServices: []
    }

    try {
      if (fs.existsSync(maintenanceFile)) {
        const maintenanceData = fs.readFileSync(maintenanceFile, 'utf8')
        maintenanceStatus = JSON.parse(maintenanceData)
      }
    } catch (error) {
      console.error('Error reading maintenance file:', error)
    }

    return NextResponse.json({
      success: true,
      data: maintenanceStatus
    })
  } catch (error) {
    console.error('Error fetching maintenance status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch maintenance status' },
      { status: 500 }
    )
  }
}

// POST /api/maintenance - Enable/disable maintenance mode
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only admins can manage maintenance mode
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      action, // 'enable', 'disable'
      message,
      startTime,
      endTime,
      affectedServices = ['trading', 'api', 'web'],
      notifyUsers = true,
      allowAdminAccess = true
    } = body

    const maintenanceFile = join(process.cwd(), 'maintenance.json')

    if (action === 'enable') {
      if (!message || !startTime || !endTime) {
        return NextResponse.json(
          { success: false, error: 'message, startTime, and endTime are required' },
          { status: 400 }
        )
      }

      const maintenanceConfig = {
        isActive: true,
        message,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        affectedServices,
        notifyUsers,
        allowAdminAccess,
        enabledBy: session.user.id,
        enabledAt: new Date()
      }

      // Write maintenance configuration
      await writeFile(maintenanceFile, JSON.stringify(maintenanceConfig, null, 2))

      // TODO: Send notifications to users if notifyUsers is true
      if (notifyUsers) {
        // Send email notifications, push notifications, etc.
      }

      return NextResponse.json({
        success: true,
        data: maintenanceConfig,
        message: 'Maintenance mode enabled successfully'
      })
    } else if (action === 'disable') {
      // Remove maintenance file
      if (fs.existsSync(maintenanceFile)) {
        fs.unlinkSync(maintenanceFile)
      }

      return NextResponse.json({
        success: true,
        message: 'Maintenance mode disabled successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error managing maintenance mode:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to manage maintenance mode' },
      { status: 500 }
    )
  }
}

// PATCH /api/maintenance - Update maintenance configuration
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only admins can update maintenance configuration
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      message,
      endTime,
      affectedServices
    } = body

    const maintenanceFile = join(process.cwd(), 'maintenance.json')

    try {
      if (!fs.existsSync(maintenanceFile)) {
        return NextResponse.json(
          { success: false, error: 'Maintenance mode is not active' },
          { status: 400 }
        )
      }

      // Read current maintenance configuration
      const currentConfig = JSON.parse(fs.readFileSync(maintenanceFile, 'utf8'))

      // Update configuration
      const updatedConfig = {
        ...currentConfig,
        ...(message && { message }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(affectedServices && { affectedServices }),
        updatedBy: session.user.id,
        updatedAt: new Date()
      }

      // Write updated configuration
      await writeFile(maintenanceFile, JSON.stringify(updatedConfig, null, 2))

      return NextResponse.json({
        success: true,
        data: updatedConfig,
        message: 'Maintenance configuration updated successfully'
      })
    } catch (error) {
      console.error('Error updating maintenance configuration:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update maintenance configuration' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error updating maintenance configuration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update maintenance configuration' },
      { status: 500 }
    )
  }
}