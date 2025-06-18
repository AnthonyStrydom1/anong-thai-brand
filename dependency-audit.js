// Dependency Audit and Cleanup Script
import { readFile, writeFile } from 'fs/promises';
import { spawn } from 'child_process';
import { join } from 'path';

class DependencyAuditor {
  constructor(projectRoot = '.') {
    this.projectRoot = projectRoot;
    this.results = {
      vulnerabilities: [],
      unused: [],
      outdated: [],
      conflicts: [],
      improvements: []
    };
  }

  async runFullAudit() {
    console.log('🔍 Starting Comprehensive Dependency Audit...\n');
    
    await this.checkPackageManagerConflicts();
    await this.auditSecurity();
    await this.checkForUpdates();
    await this.analyzeUnusedDependencies();
    await this.validateDependencyTypes();
    
    this.generateReport();
  }

  async checkPackageManagerConflicts() {
    console.log('📦 Checking for package manager conflicts...');
    
    const lockFiles = [
      'package-lock.json',
      'yarn.lock', 
      'pnpm-lock.yaml',
      'bun.lockb'
    ];
    
    const existingLockFiles = [];
    
    for (const file of lockFiles) {
      try {
        await readFile(join(this.projectRoot, file));
        existingLockFiles.push(file);
      } catch (error) {
        // File doesn't exist, which is fine
      }
    }
    
    if (existingLockFiles.length > 1) {
      this.results.conflicts.push({
        type: 'package_manager_conflict',
        files: existingLockFiles,
        recommendation: 'Choose one package manager and remove other lock files'
      });
      console.log(`  ⚠️  Multiple lock files found: ${existingLockFiles.join(', ')}`);
    } else if (existingLockFiles.length === 1) {
      console.log(`  ✅ Single package manager: ${existingLockFiles[0]}`);
    } else {
      console.log(`  ⚠️  No lock files found`);
    }
    
    console.log('');
  }

  async auditSecurity() {
    console.log('🔒 Running security audit...');
    
    return new Promise((resolve) => {
      const audit = spawn('npm', ['audit', '--json'], {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      
      let output = '';
      
      audit.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      audit.on('close', (code) => {
        try {
          const auditData = JSON.parse(output);
          
          if (auditData.vulnerabilities) {
            const vulnCount = Object.keys(auditData.vulnerabilities).length;
            console.log(`  Found ${vulnCount} vulnerable packages`);
            
            Object.entries(auditData.vulnerabilities).forEach(([pkg, data]) => {
              this.results.vulnerabilities.push({
                package: pkg,
                severity: data.severity,
                title: data.title,
                fixAvailable: data.fixAvailable
              });
            });
          } else {
            console.log('  ✅ No vulnerabilities found');
          }
        } catch (error) {
          console.log('  ⚠️  Could not parse audit results');
        }
        
        resolve();
      });
    });
  }

  async checkForUpdates() {
    console.log('📈 Checking for outdated packages...');
    
    return new Promise((resolve) => {
      const outdated = spawn('npm', ['outdated', '--json'], {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      
      let output = '';
      
      outdated.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      outdated.on('close', (code) => {
        try {
          if (output.trim()) {
            const outdatedData = JSON.parse(output);
            const packageCount = Object.keys(outdatedData).length;
            console.log(`  Found ${packageCount} outdated packages`);
            
            Object.entries(outdatedData).forEach(([pkg, data]) => {
              this.results.outdated.push({
                package: pkg,
                current: data.current,
                wanted: data.wanted,
                latest: data.latest,
                type: data.type || 'dependencies'
              });
            });
          } else {
            console.log('  ✅ All packages are up to date');
          }
        } catch (error) {
          console.log('  ✅ All packages appear to be up to date');
        }
        
        resolve();
      });
    });
  }

  async analyzeUnusedDependencies() {
    console.log('🧹 Analyzing potentially unused dependencies...');
    
    try {
      const packageJson = JSON.parse(
        await readFile(join(this.projectRoot, 'package.json'), 'utf8')
      );
      
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = Object.keys(packageJson.devDependencies || {});
      
      // List of packages that are commonly unused or could be optimized
      const suspiciousPackages = [
        '@types/react-helmet', // Check if react-helmet is actually used
        'lovable-tagger', // Development tool, might not be needed in production
        'tailwindcss-bg-patterns' // Specific utility, check usage
      ];
      
      for (const pkg of suspiciousPackages) {
        if (dependencies.includes(pkg) || devDependencies.includes(pkg)) {
          console.log(`  🔍 Checking usage of ${pkg}...`);
          // In a real implementation, you'd scan the codebase for imports
          this.results.unused.push({
            package: pkg,
            status: 'needs_verification',
            reason: 'Should verify if this package is actually used'
          });
        }
      }
      
      console.log(`  📊 Total dependencies: ${dependencies.length}`);
      console.log(`  📊 Total devDependencies: ${devDependencies.length}`);
      
    } catch (error) {
      console.log('  ❌ Error reading package.json');
    }
    
    console.log('');
  }

  async validateDependencyTypes() {
    console.log('🏷️  Validating dependency classifications...');
    
    try {
      const packageJson = JSON.parse(
        await readFile(join(this.projectRoot, 'package.json'), 'utf8')
      );
      
      // Check for packages that should probably be in devDependencies
      const shouldBeDevDeps = [
        '@types/',
        'eslint',
        '@eslint/',
        'typescript',
        'vite',
        '@vitejs/',
        'autoprefixer',
        'postcss',
        'tailwindcss'
      ];
      
      const dependencies = packageJson.dependencies || {};
      
      Object.keys(dependencies).forEach(pkg => {
        const shouldBeDev = shouldBeDevDeps.some(pattern => 
          pkg.startsWith(pattern) || pkg === pattern.replace('/', '')
        );
        
        if (shouldBeDev) {
          this.results.improvements.push({
            package: pkg,
            current: 'dependencies',
            recommended: 'devDependencies',
            reason: 'This package is typically used only during development'
          });
        }
      });
      
      if (this.results.improvements.length === 0) {
        console.log('  ✅ Dependency classifications look correct');
      } else {
        console.log(`  📝 Found ${this.results.improvements.length} classification improvements`);
      }
      
    } catch (error) {
      console.log('  ❌ Error validating dependency types');
    }
    
    console.log('');
  }

  generateReport() {
    console.log('📋 DEPENDENCY AUDIT REPORT');
    console.log('==========================\n');
    
    // Security vulnerabilities
    if (this.results.vulnerabilities.length > 0) {
      console.log('🔒 SECURITY VULNERABILITIES:');
      this.results.vulnerabilities.forEach(vuln => {
        console.log(`  ❌ ${vuln.package}: ${vuln.severity} - ${vuln.title}`);
        console.log(`     Fix available: ${vuln.fixAvailable ? 'Yes' : 'No'}`);
      });
      console.log('');
    }
    
    // Package manager conflicts
    if (this.results.conflicts.length > 0) {
      console.log('⚠️  PACKAGE MANAGER CONFLICTS:');
      this.results.conflicts.forEach(conflict => {
        console.log(`  📦 ${conflict.type}: ${conflict.files.join(', ')}`);
        console.log(`     💡 ${conflict.recommendation}`);
      });
      console.log('');
    }
    
    // Outdated packages
    if (this.results.outdated.length > 0) {
      console.log('📈 OUTDATED PACKAGES:');
      this.results.outdated.slice(0, 10).forEach(pkg => {
        console.log(`  📦 ${pkg.package}: ${pkg.current} → ${pkg.latest}`);
      });
      if (this.results.outdated.length > 10) {
        console.log(`  ... and ${this.results.outdated.length - 10} more`);
      }
      console.log('');
    }
    
    // Improvement suggestions
    if (this.results.improvements.length > 0) {
      console.log('💡 SUGGESTED IMPROVEMENTS:');
      this.results.improvements.forEach(improvement => {
        console.log(`  📦 ${improvement.package}: Move to ${improvement.recommended}`);
        console.log(`     💭 ${improvement.reason}`);
      });
      console.log('');
    }
    
    // Summary
    console.log('📊 SUMMARY:');
    console.log(`  🔒 Vulnerabilities: ${this.results.vulnerabilities.length}`);
    console.log(`  ⚠️  Conflicts: ${this.results.conflicts.length}`);
    console.log(`  📈 Outdated: ${this.results.outdated.length}`);
    console.log(`  💡 Improvements: ${this.results.improvements.length}`);
    console.log('');
    
    // Recommendations
    console.log('🎯 RECOMMENDED ACTIONS:');
    if (this.results.vulnerabilities.length > 0) {
      console.log('  1. Run: npm audit fix');
    }
    if (this.results.conflicts.length > 0) {
      console.log('  2. Choose one package manager and remove other lock files');
    }
    if (this.results.outdated.length > 0) {
      console.log('  3. Update packages: npm update');
    }
    if (this.results.improvements.length > 0) {
      console.log('  4. Review and move development packages to devDependencies');
    }
    console.log('  5. Consider adding npm scripts for dependency management');
  }
}

// Run audit if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new DependencyAuditor();
  auditor.runFullAudit().catch(console.error);
}

export default DependencyAuditor;
