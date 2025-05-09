# Migration and Security Documentation

## App Router Migration

The application has been successfully migrated from the Pages Router (`/src/pages`) to the App Router (`/app`) structure, following modern Next.js best practices.

### Migration Steps:
1. Created parallel directory structure in `/app`
2. Migrated components, utilities, and configuration files
3. Updated import paths to use relative imports
4. Maintained compatibility by keeping `/src/pages` with a README
5. Implemented a clean-up script (`scripts/cleanupAfterMigration.mts`)

### Benefits:
- Follows latest Next.js best practices
- Improved organization with co-located components
- Simplified routing structure
- Better maintainability

## Security Considerations

The application has several security measures in place to protect against common vulnerabilities:

### SQL Injection Protection
- Parameterized queries using the `pg` library
- User inputs are never directly concatenated into SQL queries
- Examples:
  ```typescript
  // Safe - uses parameterized query
  await pool.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
  ```

### Input Validation
- Email validation using regex in newsletter subscription
- Parameter validation (e.g., ID validation in blog post retrieval)
- Client-side and server-side validation

### Content Security Considerations
- **Note:** The application uses `dangerouslySetInnerHTML` for blog content. This is safe as long as content is authored by trusted parties or sanitized before storage.

### Additional Security Recommendations:
1. Implement Content Security Policy (CSP) headers
2. Add CSRF protection for forms
3. Implement rate limiting for API endpoints
4. Add input sanitization for any user-generated content
5. Consider implementing a library like DOMPurify for HTML sanitization 