/// <reference types = 'cypress'/>



describe("API examples 3", () => {
  it("Get my galleries and Delete the last one", () => {
    const userCredentials = {
      email: "bobaTest@gmail.com",
      password: "test12345",
    };

    cy.api(
      "POST",
      "https://gallery-api.vivifyideas.com/api/auth/login",
      userCredentials
    )
      .its("body")
      .then((body) => {
        console.log(body);
        const token3 = body.access_token;
        cy.log(token3);

        cy.request({
          method: "GET",
          url: "https://gallery-api.vivifyideas.com/api/my-galleries?page=1&term=",
          headers: { authorization: "Bearer " + token3 },
        }).then((respons)=>{
            console.log(respons)
            cy.log('Trenutni broj mojih galerija je: ' + respons.body.count)
            cy.log(respons.body.galleries[0].id)
            const lastID = respons.body.galleries[0].id

        

        cy.request({
            method:'DELETE',
            url: 'https://gallery-api.vivifyideas.com/api/galleries/'+lastID,
            headers:{authorization:'Bearer ' + token3}

        }).then((resp)=>{
            console.log(resp)
           // expect(resp.method).eq('DELETE')
        })

        cy.request({
            method:'GET',
            url:'https://gallery-api.vivifyideas.com/api/my-galleries?page=1&term=',
            headers:{authorization:"Bearer " + token3}

          }).then((responsMygallery)=>{
            cy.log('Posle brisanja broj mojih galerija je: ' + responsMygallery.body.count)
          })

    });


      });
  });
});
