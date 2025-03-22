
export async function loadAllEntitiesNJS(dir: string) {
    const fs = await import('fs');
    const path = await import('path');
    // Loads all entities from shared dir so they are ready to be spawned
    // by the server

    const files = fs.readdirSync(dir)
        .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    console.log(`Found ${files.length} entity files to load`);

    // Require each file to trigger the decorators
    for (const file of files) {
        const filePath = path.join(dir, file);
        require(filePath);
        console.log(`Loaded: ${file}`);
    }
}