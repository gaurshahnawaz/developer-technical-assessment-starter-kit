import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from '../src/properties/properties.controller';
import { PropertiesService } from '../src/properties/properties.service';

describe('PropertiesController', () => {
	let controller: PropertiesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PropertiesController],
			providers: [PropertiesService],
		}).compile();

		controller = module.get<PropertiesController>(PropertiesController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});