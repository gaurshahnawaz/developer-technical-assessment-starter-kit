import { Test, TestingModule } from '@nestjs/testing';
import { LandsController } from '../src/lands/lands.controller';
import { LandsService } from '../src/lands/lands.service';

describe('LandsController (e2e)', () => {
	let app: TestingModule;
	let landsController: LandsController;

	beforeAll(async () => {
		app = await Test.createTestingModule({
			controllers: [LandsController],
			providers: [LandsService],
		}).compile();

		landsController = app.get<LandsController>(LandsController);
	});

	it('should return "Hello World!"', () => {
		expect(landsController.getHello()).toBe('Hello World!');
	});
});