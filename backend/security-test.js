// Security Testing Suite for Backend API
import assert from 'assert';

class SecurityTester {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.testResults = [];
  }

  async runAllTests() {
    console.log('🔒 Starting Security Test Suite...\n');
    
    await this.testSecurityHeaders();
    await this.testRateLimiting();
    await this.testInputValidation();
    await this.testCORSConfiguration();
    await this.testCSPImplementation();
    await this.testAuthenticationSecurity();
    
    this.printResults();
  }

  async testSecurityHeaders() {
    console.log('🔍 Testing Security Headers...');
    
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const headers = response.headers;
      
      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'x-xss-protection',
        'referrer-policy',
        'content-security-policy',
        'strict-transport-security'
      ];
      
      let passed = 0;
      let total = securityHeaders.length;
      
      for (const header of securityHeaders) {
        if (headers.get(header)) {
          passed++;
          console.log(`  ✅ ${header}: ${headers.get(header)}`);
        } else {
          console.log(`  ❌ Missing: ${header}`);
        }
      }
      
      // Check for removed headers
      const removedHeaders = ['x-powered-by', 'server'];
      for (const header of removedHeaders) {
        if (!headers.get(header)) {
          console.log(`  ✅ Correctly removed: ${header}`);
        } else {
          console.log(`  ❌ Should remove: ${header}`);
          total++;
        }
      }
      
      this.addResult('Security Headers', passed, total);
      
    } catch (error) {
      console.log(`  ❌ Error testing headers: ${error.message}`);
      this.addResult('Security Headers', 0, 1);
    }
    
    console.log('');
  }

  async testRateLimiting() {
    console.log('🔍 Testing Rate Limiting...');
    
    try {
      const requests = [];
      
      // Send 105 requests quickly to trigger rate limiting
      for (let i = 0; i < 105; i++) {
        requests.push(fetch(`${this.baseUrl}/health`));
      }
      
      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      
      if (rateLimitedResponses.length > 0) {
        console.log(`  ✅ Rate limiting triggered after ${responses.length - rateLimitedResponses.length} requests`);
        console.log(`  ✅ ${rateLimitedResponses.length} requests properly rate limited`);
        this.addResult('Rate Limiting', 2, 2);
      } else {
        console.log(`  ⚠️  Rate limiting not triggered with ${requests.length} requests`);
        this.addResult('Rate Limiting', 0, 2);
      }
      
    } catch (error) {
      console.log(`  ❌ Error testing rate limiting: ${error.message}`);
      this.addResult('Rate Limiting', 0, 2);
    }
    
    console.log('');
  }

  async testInputValidation() {
    console.log('🔍 Testing Input Validation...');
    
    const maliciousInputs = [
      { name: 'XSS Script', payload: '<script>alert("xss")</script>' },
      { name: 'SQL Injection', payload: "'; DROP TABLE users; --" },
      { name: 'Path Traversal', payload: '../../etc/passwd' },
      { name: 'Template Injection', payload: '{{7*7}}' },
      { name: 'Command Injection', payload: '; ls -la' }
    ];
    
    let passed = 0;
    
    for (const test of maliciousInputs) {
      try {
        const response = await fetch(`${this.baseUrl}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: test.payload, email: 'test@test.com' })
        });
        
        if (response.status === 400) {
          console.log(`  ✅ ${test.name}: Properly blocked`);
          passed++;
        } else {
          console.log(`  ❌ ${test.name}: Not blocked (status: ${response.status})`);
        }
      } catch (error) {
        console.log(`  ⚠️  ${test.name}: Error testing - ${error.message}`);
      }
    }
    
    this.addResult('Input Validation', passed, maliciousInputs.length);
    console.log('');
  }

  async testCORSConfiguration() {
    console.log('🔍 Testing CORS Configuration...');
    
    try {
      // Test allowed origin
      const response = await fetch(`${this.baseUrl}/health`, {
        headers: { 'Origin': 'http://localhost:3000' }
      });
      
      const corsHeader = response.headers.get('access-control-allow-origin');
      
      if (corsHeader) {
        console.log(`  ✅ CORS properly configured: ${corsHeader}`);
        this.addResult('CORS Configuration', 1, 1);
      } else {
        console.log(`  ❌ CORS headers missing`);
        this.addResult('CORS Configuration', 0, 1);
      }
      
    } catch (error) {
      console.log(`  ❌ Error testing CORS: ${error.message}`);
      this.addResult('CORS Configuration', 0, 1);
    }
    
    console.log('');
  }

  async testCSPImplementation() {
    console.log('🔍 Testing Content Security Policy...');
    
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const csp = response.headers.get('content-security-policy');
      
      if (csp) {
        const cspChecks = [
          { name: 'default-src', required: true },
          { name: 'script-src', required: true },
          { name: 'style-src', required: true },
          { name: 'object-src', required: true },
          { name: 'unsafe-inline in script-src', required: false } // Should not be present
        ];
        
        let passed = 0;
        
        for (const check of cspChecks) {
          const hasDirective = csp.includes(check.name);
          
          if (check.required && hasDirective) {
            console.log(`  ✅ ${check.name}: Present`);
            passed++;
          } else if (!check.required && !hasDirective) {
            console.log(`  ✅ ${check.name}: Correctly absent`);
            passed++;
          } else {
            console.log(`  ❌ ${check.name}: ${check.required ? 'Missing' : 'Should not be present'}`);
          }
        }
        
        // Check for nonce usage
        if (csp.includes('nonce-')) {
          console.log(`  ✅ Nonce-based CSP implemented`);
          passed++;
        } else {
          console.log(`  ⚠️  Consider implementing nonce-based CSP`);
        }
        
        this.addResult('CSP Implementation', passed, cspChecks.length + 1);
      } else {
        console.log(`  ❌ Content Security Policy header missing`);
        this.addResult('CSP Implementation', 0, 1);
      }
      
    } catch (error) {
      console.log(`  ❌ Error testing CSP: ${error.message}`);
      this.addResult('CSP Implementation', 0, 1);
    }
    
    console.log('');
  }

  async testAuthenticationSecurity() {
    console.log('🔍 Testing Authentication Security...');
    
    try {
      // Test unauthenticated access to protected endpoint
      const response = await fetch(`${this.baseUrl}/api/customers`);
      
      if (response.status === 401) {
        console.log(`  ✅ Protected endpoint properly requires authentication`);
        this.addResult('Authentication Security', 1, 1);
      } else {
        console.log(`  ❌ Protected endpoint accessible without authentication (status: ${response.status})`);
        this.addResult('Authentication Security', 0, 1);
      }
      
    } catch (error) {
      console.log(`  ❌ Error testing authentication: ${error.message}`);
      this.addResult('Authentication Security', 0, 1);
    }
    
    console.log('');
  }

  addResult(testName, passed, total) {
    this.testResults.push({ testName, passed, total });
  }

  printResults() {
    console.log('📊 Security Test Results Summary:');
    console.log('================================');
    
    let totalPassed = 0;
    let totalTests = 0;
    
    for (const result of this.testResults) {
      const percentage = Math.round((result.passed / result.total) * 100);
      const status = percentage === 100 ? '✅' : percentage >= 80 ? '⚠️' : '❌';
      
      console.log(`${status} ${result.testName}: ${result.passed}/${result.total} (${percentage}%)`);
      
      totalPassed += result.passed;
      totalTests += result.total;
    }
    
    console.log('================================');
    const overallPercentage = Math.round((totalPassed / totalTests) * 100);
    const overallStatus = overallPercentage === 100 ? '✅' : overallPercentage >= 80 ? '⚠️' : '❌';
    
    console.log(`${overallStatus} Overall Security Score: ${totalPassed}/${totalTests} (${overallPercentage}%)`);
    
    if (overallPercentage >= 90) {
      console.log('🎉 Excellent security implementation!');
    } else if (overallPercentage >= 70) {
      console.log('👍 Good security baseline, some improvements needed');
    } else {
      console.log('⚠️  Security improvements required');
    }
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new SecurityTester();
  tester.runAllTests().catch(console.error);
}

export default SecurityTester;
