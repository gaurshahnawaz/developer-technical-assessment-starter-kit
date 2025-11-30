import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
	let service: ProjectsService;

	beforeEach(() => {
		service = new ProjectsService();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should return expected project', () => {
		const project = service.getProject(1);
		expect(project).toEqual({ id: 1, name: 'Test Project' });
	});

	it('should create a new project', () => {
		const newProject = service.createProject({ name: 'New Project' });
		expect(newProject).toHaveProperty('id');
		expect(newProject.name).toBe('New Project');
	});
});