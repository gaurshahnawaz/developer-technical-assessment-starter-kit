test('cache service behavior', () => {
	const cacheService = new CacheService();
	cacheService.set('key', 'value');
	expect(cacheService.get('key')).toBe('value');
	expect(cacheService.get('nonexistent')).toBeUndefined();
});