#!/usr/bin/env node
/**
 * CLI for running the Fizzy Team Simulator
 */

import { FizzyTeamSimulator, runQuickSimulation, runFullStressTest } from './simulation';

function parseArgs(): { mode: string; days?: number } {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Fizzy Team Simulator - Agentic Personas Edition

Usage: npx ts-node src/cli.ts [command] [options]

Commands:
  quick [days]  Run a quick simulation (default: 30 days)
  full          Run the full 90-day stress test
  demo          Run a short demo (10 days)

Options:
  --help, -h    Show this help message

Examples:
  npx ts-node src/cli.ts quick
  npx ts-node src/cli.ts quick 45
  npx ts-node src/cli.ts full
  npx ts-node src/cli.ts demo
`);
    process.exit(0);
  }
  
  const mode = args[0];
  const days = args[1] ? parseInt(args[1], 10) : undefined;
  
  return { mode, days };
}

async function main(): Promise<void> {
  const { mode, days } = parseArgs();
  
  console.log('🎪 Fizzy Team Simulator - Agentic Personas Edition\n');
  
  switch (mode) {
    case 'quick':
      console.log(`Running quick simulation (${days || 30} days)...\n`);
      runQuickSimulation(days || 30);
      break;
      
    case 'full':
      console.log('Running full 90-day stress test...\n');
      console.log('⚠️  This may take a while with 5,000-10,000 cards!\n');
      runFullStressTest();
      break;
      
    case 'demo':
      console.log('Running demo simulation (10 days)...\n');
      const simulator = new FizzyTeamSimulator({
        durationDays: 10,
        generatorConfig: {
          minCards: 500,
          maxCards: 1000,
          chaosLevel: 0.6
        },
        verbose: true
      });
      simulator.run();
      break;
      
    default:
      console.error(`Unknown command: ${mode}`);
      console.log('Use --help to see available commands.');
      process.exit(1);
  }
}

main().catch(error => {
  console.error('Simulation failed:', error);
  process.exit(1);
});
