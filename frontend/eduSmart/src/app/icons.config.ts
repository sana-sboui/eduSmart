import { addIcons } from 'ionicons';
import {
  schoolOutline,
  baseballOutline,
  mailOutline,
  lockClosedOutline,
  personOutline,
  callOutline,
  personAddOutline,
  documentTextOutline,
  calendarOutline,
  cameraOutline,
  addOutline,
  ellipsisVertical,
  chevronForwardOutline,
  trashOutline,
  createOutline,
  add,
  addCircle,
} from 'ionicons/icons';

export function registerIcons() {
  addIcons({
    'school-outline': schoolOutline,
    'mail-outline': mailOutline,
    'lock-closed-outline': lockClosedOutline,
    'person-outline': personOutline,
    'call-outline': callOutline,
    'baseball-outline': baseballOutline,
    'person-add-outline': personAddOutline,
    'document-text-outline': documentTextOutline,
    'calendar-outline': calendarOutline,
    'camera-outline': cameraOutline,
    'add-outline': addOutline,
    'ellipsis-vertical': ellipsisVertical,
    'chevron-forward-outline': chevronForwardOutline,
    'trash-outline': trashOutline,
    'create-outline': createOutline,
    add: add,
    'add-circle': addCircle,
  });
}
