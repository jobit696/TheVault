import { useState } from 'react';
import { useYoutubeChannel } from '../../context/YoutubeChannelContext';
import { YOUTUBE_CHANNELS } from '../../config/youtubeChannels';
import styles from '../../css/YoutubeChannelSettings.module.css';

const YoutubeChannelSettings = () => {
  const { channelId, loading, updateChannelId } = useYoutubeChannel();
  const [customChannelId, setCustomChannelId] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSelectChannel = async (selectedChannelId) => {
    setSaving(true);
    setMessage('');
    
    const success = await updateChannelId(selectedChannelId);
    
    if (success) {
      setMessage('Successfully saved!');
      setShowCustomInput(false);
    } else {
      setMessage('Error!');
    }
    
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveCustomChannel = async () => {
    if (!customChannelId.trim()) {
      setMessage('Type a valid channel ID!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setSaving(true);
    setMessage('');
    
    const success = await updateChannelId(customChannelId.trim());
    
    if (success) {
      setMessage('Custom channel saved!');
      setCustomChannelId('');
      setShowCustomInput(false);
    } else {
      setMessage('Error!');
    }
    
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}><i class="fa-brands fa-youtube"></i><span className='ms-3'>Youtube video preferences</span></h3>
      <p className={styles.description}>
        Select from which YouTube channel you want to see gameplay videos on the game pages
      </p>

      {message && (
        <div className={styles.message}>
          {message}
        </div>
      )}

      <div className={styles.channelsList}>
        {YOUTUBE_CHANNELS.map((channel) => (
          <div
            key={channel.id}
            className={`${styles.channelCard} hasElectricity ${channelId === channel.id ? styles.active : ''}`}
            onClick={() => !saving && handleSelectChannel(channel.id)}
          >
            <div className={styles.channelInfo}>
              <h4>{channel.name}</h4>
              <p>{channel.description}</p>
              {channel.isDefault && <span className={styles.badge}>Default</span>}
            </div>
            {channelId === channel.id && (
              <div className={styles.checkmark}>✓</div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.customSection}>
        {!showCustomInput ? (
          <button
            className={styles.addCustomButton}
            onClick={() => setShowCustomInput(true)}
          >
            + Add custom channel
          </button>
        ) : (
          <div className={styles.customInput}>
            <input
              type="text"
              placeholder="Inserisci Channel ID (es: UCXuqSBlHAE6Xw-yeJA0Tunw)"
              value={customChannelId}
              onChange={(e) => setCustomChannelId(e.target.value)}
              className={styles.input}
            />
            <div className={styles.customButtons}>
              <button
                onClick={handleSaveCustomChannel}
                disabled={saving}
                className={styles.saveButton}
              >
                {saving ? 'Salvataggio...' : 'Salva'}
              </button>
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomChannelId('');
                }}
                className={styles.cancelButton}
              >
                Annulla
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.helpText}>
        <p>💡 <strong>How to find a Channel ID:</strong></p> 
        <ol> 
          <li>Go to the desired YouTube channel</li>
          <li>Click on any video from the channel</li> 
          <li>Right-click → "View page source"</li> 
          <li>Search for "channelId" and copy the ID that follows</li>
        </ol>
      </div>
    </div>
  );
};

export default YoutubeChannelSettings;