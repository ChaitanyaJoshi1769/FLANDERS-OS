import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'test_token'),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const user = { id: '1', email: 'test@example.com', password: 'hashed_password' };
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed_password');
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrong_password')
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('generateTokens', () => {
    it('should return access and refresh tokens', async () => {
      const user = { id: '1', email: 'test@example.com' };

      const result = await service.generateTokens(user);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      (jwtService.verify as jest.Mock).mockReturnValue({ id: '1', email: 'test@example.com' });

      const result = service.verifyToken('valid_token');

      expect(result).toHaveProperty('id');
      expect(jwtService.verify).toHaveBeenCalledWith('valid_token');
    });

    it('should throw error for invalid token', () => {
      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => service.verifyToken('invalid_token')).toThrow();
    });
  });
});
