describe('Home Page', () => {
    it('should load the home page', () => {
        cy.visit('/');
        cy.contains('Welcome to the Home Page');
    });

    it('should display the correct title', () => {
        cy.title().should('include', 'Home');
    });

    it('should have a working navigation link', () => {
        cy.get('a').contains('About').click();
        cy.url().should('include', '/about');
    });
});