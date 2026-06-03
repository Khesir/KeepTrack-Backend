import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
class NotificationSettings {
  @Prop({ default: false }) financeReminderEnabled: boolean;
  @Prop({ default: null }) financeReminderTime: string | null;
  @Prop({ default: false }) morningReminderEnabled: boolean;
  @Prop({ default: null }) morningReminderTime: string | null;
  @Prop({ default: false }) eveningReminderEnabled: boolean;
  @Prop({ default: null }) eveningReminderTime: string | null;
  @Prop({ default: false }) taskDueReminderEnabled: boolean;
  @Prop({
    default: 'oneHour',
    enum: ['thirtyMinutes', 'oneHour', 'twoHours', 'oneDay'],
  })
  taskDueReminderDuration: string;
  @Prop({ default: true }) pomodoroNotificationsEnabled: boolean;
}

@Schema()
class PomodoroSettings {
  @Prop({ default: 25 }) pomodoroDuration: number;
  @Prop({ default: 5 }) shortBreakDuration: number;
  @Prop({ default: 15 }) longBreakDuration: number;
  @Prop({ default: 4 }) sessionsUntilLongBreak: number;
}

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true, index: true })
  authId: string;

  @Prop({ required: true, index: true })
  email: string;

  @Prop({ default: null })
  displayName: string | null;

  @Prop({ default: null })
  photoUrl: string | null;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: false })
  isPlus: boolean;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ type: NotificationSettings, default: () => ({}) })
  notificationSettings: NotificationSettings;

  @Prop({ type: PomodoroSettings, default: () => ({}) })
  pomodoroSettings: PomodoroSettings;

  // Auth fields
  @Prop({ default: null, select: false })
  passwordHash: string | null;

  @Prop({ default: null })
  googleId: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  },
});
