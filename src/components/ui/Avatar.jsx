import { useEffect, useState } from 'react'
import supabase from '../../supabase/supabase-client'
import styles from '../../css/AccountPage.module.css'

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  const uploadAvatar = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(event, filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.avatarSection}>
      <div className={styles.avatarCircle} style={{ width: size, height: size }}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#666',
            fontSize: '14px'
          }}>
            No image
          </div>
        )}
      </div>
      <div className={styles.fileInputWrapper}>
        <input
          type="file"
          id="avatar"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className={styles.fileInput}
        />
        <label htmlFor="avatar" className={styles.fileInputLabel}>
          {uploading ? 'Uploading...' : 'Choose File'}
        </label>
      </div>
    </div>
  )
}