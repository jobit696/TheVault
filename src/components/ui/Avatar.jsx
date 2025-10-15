import { useEffect, useState } from 'react'
import supabase from '../../supabase/supabase-client'
import styles from '../../css/AccountPage.module.css'

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Immagine di default 
  const defaultAvatar = '/images/default-avatar.png';

  useEffect(() => {
    if (url) {
      loadAvatar(url)
    } else {
      // Se non c'è URL, resetta l'avatar (mostrerà il default)
      setAvatarUrl(null)
    }
  }, [url])

  const loadAvatar = async (path) => {
    try {
      // Controlla se è un path locale (inizia con ../ o /)
      if (path.startsWith('../') || path.startsWith('/images/') || path.startsWith('./')) {
        // È un path locale, usalo direttamente
        setAvatarUrl(path)
        return
      }

      // Controlla se è già un URL completo
      if (path.startsWith('http://') || path.startsWith('https://')) {
        setAvatarUrl(path)
        return
      }

      // Altrimenti,  Supabase Storage
      const { data, error } = await supabase.storage.from('avatars').download(path)
      
      if (error) {
        // Se fallisce il download, prova a ottenere l'URL pubblico
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(path)
        
        if (publicUrlData?.publicUrl) {
          setAvatarUrl(publicUrlData.publicUrl)
        } else {
          throw error
        }
      } else {
        // Se il download ha successo, crea un URL dal blob
        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      }
    } catch (error) {
      console.log('Error loading avatar: ', error.message)
      // In caso di errore, usa il default
      setAvatarUrl(null)
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
const fileName = `${Math.random()}.${fileExt}`;
const filePath = `${fileName}`; 


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
        <img 
          src={avatarUrl || defaultAvatar} 
          alt={avatarUrl ? "Avatar" : "Default Avatar"}
          onError={(e) => {
            // Fallback se l'immagine non carica
            console.log('Image failed to load:', e.target.src)
            e.target.src = defaultAvatar
          }}
        />
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
          {uploading ? 'Uploading...' : avatarUrl ? 'Change Avatar' : 'Upload Avatar'}
        </label>
      </div>
    </div>
  )
}