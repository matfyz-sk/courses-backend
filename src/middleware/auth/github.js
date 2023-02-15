import axios from "axios";
import {user} from "../../model";
import runQuery from "../../query";
import Resource from "../../resource";
import {generateToken, uri2id} from "../../helpers";

const GITHUB_GET_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_GET_USER_URL = "https://api.github.com/user";
const GITHUB_CLIENT_ID = "f937b5e763fd295e11b9";
const GITHUB_CLIENT_SECRET = "b0cb4f40f0065a50f5ab671089de7208cf592614";

export async function githubLogin(req, res) {
    const code = req.query.code;

    let resp = await axios.post(GITHUB_GET_TOKEN_URL, {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
    });

    const access_token = resp.data.split("&")[0].split("=")[1];

    resp = await axios.get(`${GITHUB_GET_USER_URL}?access_token=${access_token}`);

    const email = resp.email;
    const githubId = resp.id;

    let userData;
    if (!email) {
        userData = await runQuery(user, {githubId});
    } else {
        userData = await runQuery(user, {email});
    }

    if (userData["@graph"].length === 1) {
        // prihlasenie
        userData = userData["@graph"][0];
        return res.send({
            status: true,
            _token: generateToken({userURI: userData["@id"], email: userData.email}),
            user: {
                id: uri2id(userData["@id"]),
                fullURI: userData["@id"],
                githubId,
                githubToken: access_token,
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
            },
        });
    }

    // registracia
    const u = new Resource({resource: user, setCreator: false});
    try {
        await u.setPredicate("firstName", "");
        await u.setPredicate("lastName", "");
        await u.setPredicate("email", email ? email : "");
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
        await u.setPredicate("githubId", githubId);
    } catch (err) {
        console.log(err);
        return res.status(200).send({status: false, msg: err, user: null});
    }

    await u.store();
    res.send({
        status: true,
        _token: generateToken({userURI: u.subject.iri, email: email ? email : ""}),
        user: {
            id: uri2id(u.subject.iri),
            fullURI: u.subject.iri,
            githubId,
            githubToken: access_token,
            firstName: "",
            lastName: "",
            nickname: "",
            email: email ? email : "",
            avatar: null,
            useNickName: false,
            publicProfile: false,
            showCourses: false,
            showBadges: false,
            allowContact: false,
            nickNameTeamException: false,
            isSuperAdmin: false,
            studentOf: [],
            instructorOf: [],
            requests: [],
        },
    });
}
