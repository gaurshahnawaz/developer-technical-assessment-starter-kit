import { Test, TestingModule } from '@nestjs/testing';
import { AgentContactsController } from './agent-contacts.controller';

describe('AgentContactsController', () => {
	let controller: AgentContactsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AgentContactsController],
		}).compile();

		controller = module.get<AgentContactsController>(AgentContactsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
  
	it('should return hello world', () => {
		expect(controller.helloWorld()).toBe('hello world');
	});
});