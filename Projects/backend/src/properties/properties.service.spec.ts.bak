import { PropertiesService } from './properties.service';

describe('PropertiesService', () => {
	let service: PropertiesService;

	beforeEach(() => {
		service = new PropertiesService();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should return properties list', () => {
		const properties = service.getProperties();
		expect(properties).toBeInstanceOf(Array);
	});

	it('should add a property', () => {
		const property = { id: 1, name: 'Test Property' };
		service.addProperty(property);
		expect(service.getProperties()).toContain(property);
	});
});