// src/utils/basePlugin.js
module.exports = function basePlugin(schema) {
    schema.add({
        is_deleted: { type: Boolean, default: false, index: true },
        deleted_at: { type: Date, default: null },
        created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    });

    // Auto-filter out deleted documents on find queries
    const excludeDeleted = function () {
        if (!this.getQuery().includeDeleted) {
            this.where({ is_deleted: { $ne: true } });
        }
    };

    schema.pre('find', excludeDeleted);
    schema.pre('findOne', excludeDeleted);
    schema.pre('findOneAndUpdate', excludeDeleted);
    schema.pre('countDocuments', excludeDeleted);
};
