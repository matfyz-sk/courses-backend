import axios from "axios";
import { user } from "../../model/agent/user";
import runQuery from "../../query";
import Resource from "../../resource";
import { generateToken, uri2id } from "../../helpers";

const GITHUB_GET_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_GET_USER_URL = "https://api.github.com/user";
const GITHUB_CLIENT_ID = "f937b5e763fd295e11b9";
const GITHUB_CLIENT_SECRET = "b0cb4f40f0065a50f5ab671089de7208cf592614";

export async function githubLogin(req, res) {
   const code = req.query.code;
   var access_token = null;

   var resp = await axios.post(GITHUB_GET_TOKEN_URL, {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
   });

   access_token = resp.data.split("&")[0].split("=")[1];

   resp = await axios.get(`${GITHUB_GET_USER_URL}?access_token=${access_token}`);

   const email = resp.email;
   var userData;
   if (!email) {
      userData = await runQuery(user, { githubToken: access_token });
   } else {
      userData = await runQuery(user, { email });
   }

   if (userData["@graph"].length === 1) {
      // prihlasenie
      userData = userData["@graph"][0];
      return res.send({
         status: true,
         _token: generateToken({ userURI: userData["@id"], email: userData.email }),
         user: {
            id: uri2id(userData["@id"]),
            fullURI: userData["@id"],
            firstName: userData.firstName,
            lastName: userData.lastName,
            description: userData.description,
            nickname: userData.nickname,
            email: userData.email,
            avatar: userData.avatar ? userData.avatar : null,
            useNickName: userData.useNickName,
            publicProfile: userData.publicProfile,
            showCourses: userData.showCourses,
            showBadges: userData.showBadges,
            allowContact: userData.allowContact,
            nickNameTeamException: userData.nickNameTeamException,
            isSuperAdmin: userData.isSuperAdmin,
            studentOf: userData.studentOf,
            instructorOf: userData.instructorOf,
            requests: userData.requests,
            githubToken: access_token,
         },
      });
   }

   // registracia
   const u = new Resource({ resource: user, setCreator: false });
   try {
      await u.setPredicate("firstName", "");
      await u.setPredicate("lastName", "");
      await u.setPredicate("email", "");
      await u.setPredicate("password", "");
      await u.setPredicate("description", "");
      await u.setPredicate("nickname", "");
      await u.setPredicate("useNickName", false);
      await u.setPredicate("publicProfile", false);
      await u.setPredicate("showCourses", false);
      await u.setPredicate("showBadges", false);
      await u.setPredicate("allowContact", false);
      await u.setPredicate("nickNameTeamException", false);
      await u.setPredicate("isSuperAdmin", false);
      await u.setPredicate("githubToken", access_token);
   } catch (err) {
      console.log(err);
      return res.status(200).send({ status: false, msg: err, user: null });
   }

   await u.store();
   let token = generateToken({ userURI: u.subject.iri, email: "" });
   res.send({
      status: true,
      _token: token,
      user: {
         id: uri2id(u.subject.iri),
         fullURI: u.subject.iri,
         firstName: user.first_name,
         lastName: user.last_name,
         nickname: privacy.nickname ? privacy.nickname : null,
         email: user.email,
         avatar: user.avatar ? user.avatar : null,
         useNickName: privacy.use_nickname,
         publicProfile: privacy.public_profile,
         showCourses: privacy.show_courses,
         showBadges: privacy.show_badges,
         allowContact: privacy.allowContact,
         nickNameTeamException: privacy.nickNameTeamException,
         isSuperAdmin: false,
         studentOf: [],
         instructorOf: [],
         requests: [],
         githubToken: access_token,
      },
   });

   // axios
   //    .post(GITHUB_GET_TOKEN_URL, {
   //       client_id: GITHUB_CLIENT_ID,
   //       client_secret: GITHUB_CLIENT_SECRET,
   //       code,
   //    })
   //    .then((resp) => {
   //       const access_token = resp.data.split("&")[0].split("=")[1];
   //       return axios.get(`${GITHUB_GET_USER_URL}?access_token=${access_token}`);
   //    })
   //    .then((resp) => {
   //       const email = resp.email;
   //       if (!email) {
   //          return res.status(200).send({
   //             status: false,
   //             msg: "Empty email",
   //          });
   //       }
   //       return runQuery(user, { email });
   //    })
   //    .then((data) => {
   //       if (data["@graph"].length == 0) {
   //          return res.status(200).send({
   //             status: false,
   //             msg: "Credentials not valid",
   //          });
   //       }
   //       const userData = data["@graph"][0];
   //       res.send({
   //          status: true,
   //          _token: generateToken({ userURI: userData["@id"], email: userData.email }),
   //          user: {
   //             id: uri2id(userData["@id"]),
   //             fullURI: userData["@id"],
   //             firstName: userData.firstName,
   //             lastName: userData.lastName,
   //             description: userData.description,
   //             nickname: userData.nickname,
   //             email: userData.email,
   //             avatar: userData.avatar ? userData.avatar : null,
   //             useNickName: userData.useNickName,
   //             publicProfile: userData.publicProfile,
   //             showCourses: userData.showCourses,
   //             showBadges: userData.showBadges,
   //             allowContact: userData.allowContact,
   //             nickNameTeamException: userData.nickNameTeamException,
   //             isSuperAdmin: userData.isSuperAdmin,
   //             studentOf: userData.studentOf,
   //             instructorOf: userData.instructorOf,
   //             requests: userData.requests,
   //          },
   //       });
   //    })
   //    .catch((err) => {
   //       console.log(err);
   //       res.status(500).send({ status: false, msg: err });
   //    });
}
