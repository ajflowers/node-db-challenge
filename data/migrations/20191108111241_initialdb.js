
exports.up = function(knex) {
    return knex.schema
        .createTable('projects', tbl => {
            tbl.increments();            
            tbl.string('name', 255).notNullable().unique();            
            tbl.string('description', 255);
            tbl.boolean('completed').notNullable().defaultTo(false);
        })
        .createTable('resources', tbl => {
            tbl.increments();
            tbl.string('name', 255).notNullable()
            tbl.string('description', 255)
        })
        .createTable('tasks', tbl => {
            tbl.increments();
            tbl.string('description', 255).notNullable();
            tbl.string('notes', 255);
            tbl
                .integer('project_id')
                .unsigned()
                .references('id')
                .inTable('projects')
                .onDelete('RESTRICT')
                .onUpdate('cascade');
        })
        .createTable('projecct_resources', tbl => {
            tbl.increments();

            tbl
                .integer('project_id')
                .unsigned()
                .references('id')
                .inTable('projects')
                .onDelete('RESTRICT')
                .onUpdate('cascade');

            tbl
                .integer('resource_id')
                .unsigned()
                .references('id')
                .inTable('resources')
                .onDelete('RESTRICT')
                .onUpdate('cascade');
        })
        
  
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('project_resources')
        .dropTableIfExists('tasks')
        .dropTableIfExists('resources')
        .dropTableIfExists('projects')
};
