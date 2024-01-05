import styles from './FileInput.module.scss';
import { Button } from 'projex-ui';
import React, { InputHTMLAttributes, useRef, useState } from 'react';

export interface PropsTypes extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'crossOrigin'> {
  onChange: (files: FileList) => void;
}

export default function FileInput({ onChange, ...props }: PropsTypes) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // handle drag events
  function handleDrag(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  // triggers when file is dropped
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files);
      // at least one file has been dropped so do something
      // handleFiles(e.dataTransfer.files);
    }
  }

  function onButtonClick() {
    if (!inputRef?.current) return;
    inputRef.current.click();
  }

  // triggers when file is selected with click
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files);
      // at least one file has been selected so do something
      // handleFiles(e.target.files);
    }
  }

  return (
    <div className={styles.uploadDraggerContainer} onDragEnter={handleDrag}>
      <input type="file" name="file-upload" ref={inputRef} onChange={handleChange} {...props} />
      <div className={`${styles.uploadDragger} ${dragActive ? styles.dragActive : ''}`}>
        <label htmlFor="file-upload-button" className="text-small">
          Afin d’ajouter des fichiers, vous pouvez glisser les documents depuis votre explorateur, ou utiliser le bouton
          ci-dessous.
        </label>
        <div className={styles.buttonContainer}>
          <Button style={'secondary'} onClick={onButtonClick}>
            Charger des fichiers
          </Button>
        </div>
      </div>
      {dragActive && (
        <div
          className={styles.dragOverlay}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </div>
  );
}
