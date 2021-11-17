import { Test, TestingModule } from '@nestjs/testing';
import { GoogleOauth2Controller } from './google-oauth2.controller';

describe('GoogleOauth2Controller', () => {
  let controller: GoogleOauth2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleOauth2Controller],
    }).compile();

    controller = module.get<GoogleOauth2Controller>(GoogleOauth2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
