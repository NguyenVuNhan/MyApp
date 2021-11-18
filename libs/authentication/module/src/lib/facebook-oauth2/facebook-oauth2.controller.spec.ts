import { Test, TestingModule } from '@nestjs/testing';
import { FacebookOauth2Controller } from './facebook-oauth2.controller';

describe('FacebookOauth2Controller', () => {
  let controller: FacebookOauth2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacebookOauth2Controller],
    }).compile();

    controller = module.get<FacebookOauth2Controller>(FacebookOauth2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
