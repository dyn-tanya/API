import pet from '../fixtures/pet.json'
import { faker } from '@faker-js/faker';

pet.id = faker.number.int()
pet.name = faker.animal.cat.name
pet.category.id = faker.number.int(3)
pet.category.name = faker.animal.type()

//1
it('Create pet', () => {
  cy.log(`Create pet with id: ${pet.id}`)

  cy.request('POST', '/pet', pet).then(response => {

    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
  })
})

//2
it('Get pet by id', () => {
  cy.log(`Get pet with id: ${pet.id}`)

  cy.request('GET', `/pet/${pet.id}`).then(response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
    expect(response.body.category.id).to.be.equal(pet.category.id);
    expect(response.body.category.name).to.be.equal(pet.category.name);
  })
})

//3
it('Update pet', () => {
  cy.log(`Update pet with id: ${pet.id}`);

  pet.name = 'Qweqwe';
  pet.status = 'sold';

  cy.request('PUT', '/pet', pet).then(response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
    expect(response.body.status).to.be.equal(pet.status);
  })

  cy.request('GET', `/pet/${pet.id}`).then(response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
    expect(response.body.category.id).to.be.equal(pet.category.id);
    expect(response.body.category.name).to.be.equal(pet.category.name);
  })
})

//4
it('Find pet by status', () => {
  cy.log(`Find pet with id: ${pet.id}`)

  cy.request('GET', `/pet/findByStatus?status=${pet.status}`).then(response => {
    expect(response.status).to.be.equal(200);

    let pets = response.body;
    let resultPetArray = pets.filter(myPet => {
      return myPet.id === pet.id
    })

    expect(resultPetArray[0]).to.be.eql(pet);
  })
})


//5
it('Updates pet using form data', () => {
  cy.log(`Updates pet using form data with id: ${pet.id}`)

  cy.request({
    method: 'POST',
    url: `/pet/${pet.id}`,
    form: true,
    body: {
      name: 'qwe',
      status: 'available'
    }
  }).then(response => {
    cy.log(JSON.stringify(response.body));

    expect(response.status).to.be.equal(200);
    expect(response.body.type).to.be.equal('unknown')
    expect(response.body.message).to.be.equal(`${pet.id}`)
  })

  cy.request('GET', `/pet/${pet.id}`).then(response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal('qwe');
    expect(response.body.status).to.be.equal('available');
  })

})

//6
it('Delete pet', () => {
  cy.log(`Delete pet with id: ${pet.id}`)

  cy.request({
    method: 'DELETE',
    url: `/pet/${pet.id}`,
  }).then(response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(undefined);
    expect(response.body.name).to.be.equal(undefined);

  })

  cy.request({
    method: 'GET',
    url: `/pet/${pet.id}`,
    failOnStatusCode: false
  }).then(response => {
    expect(response.status).to.be.equal(404);
    expect(response.body.id).to.be.equal(undefined);
    expect(response.body.name).to.be.equal(undefined);
  })
})

