import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class Photos {
    
    async takePicture() {
        const capturedPhoto = await Camera.getPhoto({
            source: CameraSource.Camera,
            allowEditing: false,
            quality: 90,
            resultType: CameraResultType.DataUrl
        });
        
        return capturedPhoto.dataUrl;
        
    }
    
    async pickPicture() {
        const pickedPhoto = await Camera.getPhoto({
            source: CameraSource.Photos,
            quality: 90,
            resultType: CameraResultType.DataUrl
        });
        return pickedPhoto.dataUrl;
    }
    
}
