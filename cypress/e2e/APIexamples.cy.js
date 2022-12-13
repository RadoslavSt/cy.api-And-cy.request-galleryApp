/// <reference types = 'cypress'/>

describe("API examples", () => {
  const userCredentials = {
    email: "bobaTest@gmail.com",
    password: "test12345",
  };

  it("Log in,create new gallery and add a comment", () => {
    const createArticle = {
      title: "api Article",
      description: "APi description",
      images: [
        "https://freesvgplanet.com//wp-content//uploads//2019//10//pokemon-svg-free-30195-758x505.jpg",
      ],
    };

    cy.api(
      "POST",
      "https://gallery-api.vivifyideas.com/api/auth/login",
      userCredentials
    )
      .its("body")
      .then((body) => {
        const tokenConst = body.access_token;
        console.log(body);

        cy.request({
          method: "POST",
          url: "https://gallery-api.vivifyideas.com/api/galleries",
          headers: { authorization: "Bearer " + tokenConst },
          body: createArticle,
        }).then((responsive) => {
          console.log(responsive);
          expect(responsive.status).eq(201);
          expect(responsive.statusText).eq("Created");
          cy.log(responsive.body.id);
          const galleryID = responsive.body.id;

          cy.request({
            method: "POST",
            url: "https://gallery-api.vivifyideas.com/api/comments",
            headers: { authorization: "Bearer " + tokenConst },
            body: {
              gallery_id: galleryID,
              body: "api comments on the last created gallery",
            },
          }).then((responsiveComment) => {
            expect(responsiveComment.status).eq(200);
          });
        });
      });
  });
});
