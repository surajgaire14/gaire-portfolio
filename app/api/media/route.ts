import { NextRequest, NextResponse } from 'next/server'
import { getAllMediaFiles, saveMediaFile, getMediaStats } from '@/lib/media-server'

export async function GET() {
  try {
    const files = await getAllMediaFiles()
    const stats = await getMediaStats()
    
    return NextResponse.json({
      files,
      stats,
    })
  } catch (error) {
    console.error('Failed to get media files:', error)
    return NextResponse.json(
      { error: 'Failed to get media files' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Save file
    const mediaFile = await saveMediaFile(buffer, file.name, file.type)
    
    return NextResponse.json({
      success: true,
      file: mediaFile,
    })
  } catch (error) {
    console.error('Failed to upload file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 