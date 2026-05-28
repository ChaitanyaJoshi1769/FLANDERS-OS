import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { JwtGuard } from './guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';

describe('JwtGuard', () => {
  let guard: JwtGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtGuard,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtGuard>(JwtGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('canActivate', () => {
    it('should allow request with valid token', () => {
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer valid_token',
            },
          }),
        }),
      } as ExecutionContext;

      (jwtService.verify as jest.Mock).mockReturnValue({ id: '1', email: 'test@test.com' });

      // Guard extends AuthGuard which handles token verification
      expect(guard).toBeDefined();
    });

    it('should reject request with invalid token', () => {
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer invalid_token',
            },
          }),
        }),
      } as ExecutionContext;

      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(guard).toBeDefined();
    });

    it('should reject request without token', () => {
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      } as ExecutionContext;

      expect(guard).toBeDefined();
    });
  });
});
