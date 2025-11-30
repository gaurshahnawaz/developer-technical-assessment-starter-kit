import { Test, TestingModule } from '@nestjs/testing';
import { AgentContactsService } from './agent-contacts.service';

describe('AgentContactsService', () => {
	let service: AgentContactsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AgentContactsService],
		}).compile();

		service = module.get<AgentContactsService>(AgentContactsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
  
	it('should return hello world', () => {
		expect(service.helloWorld()).toBe('hello world');
	});
});