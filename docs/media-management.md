# Media Management System

This document explains how to use the media management system that replaces Vercel Blob with local file storage.

## Overview

The media management system provides:
- Local file storage in the `public/media` directory
- Media manager interface in the admin panel
- Reusable components for media selection
- File upload, deletion, and organization capabilities

## Features

### 1. Media Manager (`/admin/media`)
- Upload multiple files via drag & drop
- View all uploaded files in a grid layout
- Search and filter files by type
- Delete files
- Copy file URLs
- Download files
- Statistics dashboard

### 2. Media Picker Component
- Select media files from the library
- Preview selected files
- Search functionality
- Modal interface

### 3. Media Field Component
- Form field for media selection
- Preview of selected file
- Clear selection option

## File Structure

```
lib/
  media.ts              # Core media utilities
app/
  api/media/
    route.ts            # GET/POST media files
    [filename]/route.ts # DELETE specific file
  admin/media/
    page.tsx            # Media manager page
components/
  media/
    media-upload.tsx    # Upload component
    media-grid.tsx      # Grid display component
    media-picker.tsx    # Selection component
    media-field.tsx     # Form field component
public/
  media/                # File storage directory
```

## Usage Examples

### 1. Using MediaField in Forms

```tsx
import { MediaField } from '@/components/media/media-field'

export function MyForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  return (
    <form>
      <MediaField
        label="Profile Image"
        value={imageUrl}
        onChange={setImageUrl}
        required
      />
      {/* Other form fields */}
    </form>
  )
}
```

### 2. Using MediaPicker Directly

```tsx
import { MediaPicker } from '@/components/media/media-picker'
import { MediaFile } from '@/lib/media'

export function MyComponent() {
  const handleSelect = (file: MediaFile) => {
    console.log('Selected file:', file.url)
  }

  return (
    <MediaPicker
      onSelect={handleSelect}
      title="Choose Image"
      description="Select an image for your post"
    />
  )
}
```

### 3. Custom Upload Component

```tsx
import { MediaUpload } from '@/components/media/media-upload'

export function MyUploader() {
  const handleUploadComplete = (file: MediaFile) => {
    console.log('Uploaded:', file.url)
  }

  const handleUploadError = (error: string) => {
    console.error('Upload failed:', error)
  }

  return (
    <MediaUpload
      onUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
      maxFiles={5}
      acceptedTypes={['image/*']}
    />
  )
}
```

## API Endpoints

### GET /api/media
Returns all media files and statistics.

**Response:**
```json
{
  "files": [
    {
      "id": "unique-id",
      "filename": "image-123456.jpg",
      "originalName": "profile.jpg",
      "path": "media/image-123456.jpg",
      "url": "/media/image-123456.jpg",
      "size": 1024000,
      "mimeType": "image/jpeg",
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "stats": {
    "totalFiles": 10,
    "totalSize": 10240000,
    "fileTypes": {
      ".jpg": 5,
      ".png": 3,
      ".pdf": 2
    }
  }
}
```

### POST /api/media
Upload a new file.

**Request:** FormData with `file` field

**Response:**
```json
{
  "success": true,
  "file": {
    "id": "unique-id",
    "filename": "image-123456.jpg",
    "originalName": "profile.jpg",
    "path": "media/image-123456.jpg",
    "url": "/media/image-123456.jpg",
    "size": 1024000,
    "mimeType": "image/jpeg",
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### DELETE /api/media/[filename]
Delete a specific file.

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## File Storage

Files are stored in the `public/media` directory with the following structure:
- Unique filenames are generated to prevent conflicts
- Original filenames are preserved in metadata
- Files are organized by upload date
- Direct access via `/media/filename` URLs

## Security Considerations

1. **File Type Validation**: Only allowed file types can be uploaded
2. **File Size Limits**: Consider implementing size limits in production
3. **Access Control**: Media manager is only accessible to admin users
4. **File Deletion**: Only admin users can delete files

## Migration from Vercel Blob

The system automatically handles migration from Vercel Blob URLs:
- Existing URLs starting with `http` are preserved
- New uploads use local storage
- No data migration required

## Customization

### Adding New File Types

Update the `getMimeType` function in `lib/media.ts`:

```typescript
const mimeTypes: Record<string, string> = {
  // ... existing types
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  // Add more as needed
}
```

### Custom File Validation

Modify the `saveMediaFile` function to add custom validation:

```typescript
export async function saveMediaFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<MediaFile> {
  // Add custom validation here
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error('File too large')
  }
  
  // ... rest of the function
}
```

## Troubleshooting

### Common Issues

1. **Files not uploading**: Check directory permissions for `public/media`
2. **Images not displaying**: Ensure Next.js is configured to serve static files
3. **Delete not working**: Verify file permissions and API route configuration

### Debug Mode

Enable debug logging by adding console.log statements in the media utilities:

```typescript
export async function saveMediaFile(...) {
  console.log('Saving file:', originalName)
  // ... implementation
}
``` 