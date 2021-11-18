import { Test, TestingModule } from '@nestjs/testing';
import { FacebookOauth2Service } from './facebook-oauth2.service';

describe('FacebookOauth2Service', () => {
  let service: FacebookOauth2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacebookOauth2Service],
    }).compile();

    service = module.get<FacebookOauth2Service>(FacebookOauth2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
