import { Test, TestingModule } from '@nestjs/testing';
import { GoogleOauth2Service } from './google-oauth2.service';

describe('GoogleOauth2Service', () => {
  let service: GoogleOauth2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleOauth2Service],
    }).compile();

    service = module.get<GoogleOauth2Service>(GoogleOauth2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
