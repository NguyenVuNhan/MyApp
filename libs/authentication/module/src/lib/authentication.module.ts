import { Module } from '@nestjs/common';
import { UserModule } from '@app/user/module';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [UserModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [],
})
export class AuthenticationModule {}
