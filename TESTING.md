# FLANDERS OS Testing Strategy & Guide

Comprehensive testing approach for quality assurance and reliability.

## Test Pyramid

```
        E2E Tests
      Integration Tests
      Unit Tests
  (Broad Base - Many Tests)
```

### Distribution Target
- Unit Tests: 70% (Fast, focused)
- Integration Tests: 20% (Module integration)
- E2E Tests: 10% (User workflows)

## Unit Testing

### Framework: Jest
- **Config**: `jest.config.js` in each app
- **Coverage Target**: 80%+ per module
- **Timeout**: 10 seconds per test

### Test Structure
```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let mockDependency: any;

  beforeEach(async () => {
    // Setup mocks and test module
  });

  describe('methodName', () => {
    it('should do something when condition is met', () => {
      // Arrange
      const input = ...;
      
      // Act
      const result = service.method(input);
      
      // Assert
      expect(result).toBe(...);
    });
  });
});
```

### Testing Patterns

#### Service Testing
- Mock repositories
- Mock external dependencies
- Test all code paths
- Test error scenarios
- Test edge cases

#### Controller Testing
- Mock service calls
- Test request validation
- Test response formatting
- Test error handling
- Test authentication/authorization

#### Guard Testing
- Test valid tokens
- Test expired tokens
- Test invalid tokens
- Test missing tokens
- Test role-based access

### Coverage Areas

| Module | Coverage Target | Key Tests |
|--------|-----------------|-----------|
| auth | 90% | Login, token refresh, logout, MFA |
| fleet | 85% | CRUD, list, filter, status |
| machine | 85% | Health tracking, status updates |
| maintenance | 80% | Predictions, RUL calculations |
| safety | 80% | Incident reporting, compliance |
| integration | 75% | ERP sync, webhook delivery |
| autonomous | 75% | Mission planning, execution |

## Integration Testing

### Framework: Jest + Supertest
- **Database**: Test database (PostgreSQL)
- **Scope**: Module interactions
- **Timeout**: 30 seconds per test

### Test Categories

#### API Integration Tests
```typescript
describe('Fleet API', () => {
  it('POST /fleets should create fleet', async () => {
    const response = await request(app)
      .post('/fleets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Fleet',
        organizationId: 'org-1',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

#### Database Tests
- Connection pooling
- Transaction handling
- Cascade operations
- Constraint validation
- Concurrency handling

#### Authentication Flow
- Login flow
- Token refresh
- Logout
- MFA validation
- Session management

## End-to-End Testing

### Framework: Cypress (Web), Detox (Mobile)
- **Environment**: Staging
- **Scope**: User workflows
- **Timeout**: 2 minutes per test

### Test Scenarios

#### Login & Dashboard
```
1. Navigate to login page
2. Enter credentials
3. Verify dashboard loads
4. Check fleet cards display
5. Verify statistics update
```

#### Fleet Management
```
1. Login
2. Navigate to fleets
3. Create new fleet
4. View fleet details
5. Update fleet status
6. Delete fleet
```

#### Mission Management
```
1. Login
2. Create mission with waypoints
3. Assign to fleet
4. Track execution
5. Update status
6. Generate report
```

#### Safety Incident Reporting
```
1. Login
2. Report incident
3. Fill severity & type
4. Add description
5. Assign to crew
6. Verify notification sent
```

## Test Data Management

### Fixtures
- User accounts with different roles
- Test organizations
- Sample fleets and machines
- Pre-configured missions
- Baseline incidents

### Seeding
```typescript
async function seedTestData() {
  const org = await createOrganization({ name: 'Test Org' });
  const user = await createUser({ 
    email: 'test@example.com',
    organizationId: org.id 
  });
  const fleet = await createFleet({
    name: 'Test Fleet',
    organizationId: org.id
  });
  // ... more seeding
}
```

### Cleanup
- Clear database after each test suite
- Remove test files
- Reset external service mocks
- Clear cache

## Performance Testing

### Load Testing
- **Tool**: k6
- **Scenarios**: Baseline, Normal, Peak, Spike
- **Duration**: 5-30 minutes per scenario

### Load Test Script Example
```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  let response = http.get('https://api.flanders-os.io/fleets', {
    headers: { 'Authorization': `Bearer ${__ENV.TOKEN}` }
  });
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

### Metrics
- Response time (P50, P95, P99)
- Error rate
- Throughput (requests/second)
- Resource utilization

## Security Testing

### OWASP Top 10 Coverage
1. **Injection**: SQL injection, command injection
2. **Authentication**: Bypass, brute force, MFA bypass
3. **Sensitive Data**: Exposure, encryption, PII
4. **XML External Entities**: XXE attacks
5. **Broken Access Control**: Authorization bypass
6. **Security Misconfiguration**: Default configs
7. **XSS**: Stored, reflected, DOM-based
8. **Insecure Deserialization**: Object injection
9. **Using Components with Known Vulnerabilities**: Dependency scanning
10. **Insufficient Logging**: Security event tracking

### Test Cases
- SQL injection attempts
- Authentication bypass
- CSRF token validation
- XSS payload injection
- Rate limiting effectiveness
- Session handling

## Continuous Integration

### Pipeline Stages
1. **Lint**: Code style and formatting
2. **Unit Tests**: Jest coverage
3. **Build**: Compile TypeScript
4. **Integration Tests**: Module integration
5. **Security Scan**: Dependency vulnerabilities
6. **Performance**: Bundle size check
7. **E2E Tests**: Critical workflows
8. **Deploy**: Staging deployment

### Git Hooks
```bash
# pre-commit
npm run lint
npm run format

# pre-push
npm run test
npm test -- --coverage
```

## Test Execution

### Running Tests

```bash
# Unit tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# Integration tests
npm run test:integration

# E2E tests (web)
npm run cypress:open

# E2E tests (mobile)
npm run detox:test

# Load testing
k6 run load-test.js

# Security testing
npm run security:audit
```

### Coverage Reporting
- HTML report: `coverage/index.html`
- Coverage upload to Codecov
- SonarQube integration
- Trend analysis

## Quality Metrics

### Code Quality
- Unit test coverage: 80%+
- Cyclomatic complexity: < 10
- Maintainability index: > 70
- Code duplication: < 3%

### API Quality
- P95 response time: < 500ms
- Error rate: < 0.1%
- Security score: A+
- Documentation: 100%

### Mobile Quality
- Crash rate: < 0.01%
- ANR (Android): < 0.1%
- Frame drops: < 5%
- Battery impact: < 5%

## Test Maintenance

### Regular Tasks
- Update test fixtures (weekly)
- Review failing tests (daily)
- Refactor test utilities (monthly)
- Update dependencies (weekly)
- Performance baseline update (quarterly)

### Anti-Patterns to Avoid
- Flaky tests (non-deterministic results)
- Test interdependencies (order matters)
- Excessive mocking (testing mocks, not code)
- Magic numbers (use constants)
- Long test setup (use factories)

## Documentation

### Test Comments
```typescript
// When: User has valid token and sufficient permissions
// Then: Fleet creation succeeds with 201 status
it('should create fleet with valid credentials', () => {
  // Test implementation
});
```

### Test Naming
- Descriptive, clear names
- Format: `should [expected behavior] when [condition]`
- Examples:
  - `should return users when organization exists`
  - `should throw error when email invalid`
  - `should update status when authorized`

## Resources

- Jest Documentation: https://jestjs.io/
- Supertest: https://github.com/visionmedia/supertest
- Cypress: https://docs.cypress.io/
- k6: https://k6.io/
- OWASP Testing: https://owasp.org/www-project-web-security-testing-guide/

---

Last Updated: 2026-05-28
Coverage Target: 80%+ across all modules
Next Review: 2026-08-28
