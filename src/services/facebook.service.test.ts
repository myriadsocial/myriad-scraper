import { FacebookService, FBPost } from './facebook.service';
import {gun} from "../app";

describe('Facebook Service\'s Unit Tests ', () => {
  it('JSON.parse is able to convert the string to an object successfully', () => {
    const testString = `{'original_request_url': '2909620835944566', 'post_url': 'https://facebook.com/story.php?story_fbid=10158440915312339&id=67919847338', 'post_id': '10158440915312339', 'text': 'Introducing Steam Deck: powerful, portable', 'post_text': 'Introducing Steam Deck: powerful, portable PC gaming starting at $399. Designed by Valve, powered by Steam. Shipping December 2021. Learn more at http://steamdeck.com and reserve yours tomorrow.', 'shared_text': '', 'time': datetime.datetime(2021, 7, 15, 17, 33, 20), 'timestamp': None, 'image': None, 'image_lowquality': 'https://scontent.fdps6-1.fna.fbcdn.net/v/t15.5256-10/cp0/e15/q65/s1080x2048/204764675_2909623812610935_1586930686399959836_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=ccf8b3&efg=eyJpIjoidCJ9&_nc_ohc=nJv_qsJY9o0AX_lZZ1r&tn=mBCK8cqEm6gXpGnH&_nc_ht=scontent.fdps6-1.fna&oh=27ba30385134d285fa7c858f077b74d7&oe=6172AD69', 'images': [], 'images_description': [], 'images_lowquality': ['https://scontent.fdps6-1.fna.fbcdn.net/v/t15.5256-10/cp0/e15/q65/s1080x2048/204764675_2909623812610935_1586930686399959836_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=ccf8b3&efg=eyJpIjoidCJ9&_nc_ohc=nJv_qsJY9o0AX_lZZ1r&tn=mBCK8cqEm6gXpGnH&_nc_ht=scontent.fdps6-1.fna&oh=27ba30385134d285fa7c858f077b74d7&oe=6172AD69'], 'images_lowquality_description': [None], 'video': 'https://video.fdps6-1.fna.fbcdn.net/v/t42.1790-2/218390126_406633600703200_905893498720499759_n.mp4?_nc_cat=102&ccb=1-5&_nc_sid=985c63&efg=eyJybHIiOjMwMCwicmxhIjo1MTIsInZlbmNvZGVfdGFnIjoic3ZlX3NkIn0%3D&_nc_ohc=KDUMq-_N8jMAX8kcN0r&tn=mBCK8cqEm6gXpGnH&_nc_rml=0&_nc_ht=video.fdps6-1.fna&oh=20fa6e5b4055054ad18e765f75a70b31&oe=616E7F83', 'video_duration_seconds': 25, 'video_height': 1080, 'video_id': '2909620835944566', 'video_quality': '1080p', 'video_size_MB': 88.155409, 'video_thumbnail': 'https://scontent.fdps6-1.fna.fbcdn.net/v/t15.5256-10/cp0/e15/q65/s1080x2048/204764675_2909623812610935_1586930686399959836_n.jpg', 'video_watches': 1537114, 'video_width': 1920, 'likes': 39000, 'comments': 13077, 'shares': 22664, 'link': 'http://steamdeck.com/?fbclid=IwAR3OOCRtbZdGkFMnSBZwXP84ptr-_hiyThmZqePsXB4dXyprbaBzB_OTwck', 'links': [{'link': 'https://lm.facebook.com/l.php?u=http%3A%2F%2Fsteamdeck.com%2F%3Ffbclid%3DIwAR3OOCRtbZdGkFMnSBZwXP84ptr-_hiyThmZqePsXB4dXyprbaBzB_OTwck&h=AT1rUti6HLkkusqGTuFl8ObYY3MDnNj3tiKIOSVWJBLp18f9_U8hv1-RxvWszCGI5cXQ17LqcL9yezgRjZKMCzRUDWRTXFRdmwZ89kJXQ4rOnBcbjWZy2xyltdOkhKCH7b9XD2XK8OFb9jl42nPEQw', 'text': 'http://steamdeck.com'}], 'user_id': '67919847338', 'username': 'Steam', 'user_url': 'https://facebook.com/Steam/?refid=52&__tn__=C-R', 'is_live': False, 'factcheck': None, 'shared_post_id': None, 'shared_time': None, 'shared_user_id': None, 'shared_username': None, 'shared_post_url': None, 'available': True, 'comments_full': None, 'reactors': None, 'w3_fb_url': None, 'reactions': None, 'reaction_count': None, 'with': None, 'image_id': None, 'image_ids': [], 'was_live': False}`;
    const result = new FacebookService().pythonToJSobject(testString);
    let obj = JSON.parse(result);
    expect(typeof obj).toBe("object");
  });
  //TODO: not working, need the test to wait until Gun has initialized but not sure how
  it('', async () => {
    const creatorUsername = "fbUsername";
    const urlId = "1985379875607908"
    const post: FBPost = {
      text: "Introducing Steam Deck: powerful, portable PC gaming starting at $399. Designed by Valve, powered by Steam. Shipping December 2021.\n\nLearn more at http://steamdeck.com and re.",
      video: `https://video.fdps6-1.fna.fbcdn.net/v/t42.1790-2/218390126_406633600703200_905893498720499759_n.mp4?_nc_cat=102&ccb=1-5&_nc_sid=985c63&efg=eyJybHIiOjMwMCwicmxhIjo1MTIsInZlbmNvZGVfdGFnIjoic3ZlX3NkIn0%3D&_nc_ohc=KDUMq-_N8jMAX8kcN0r&tn=mBCK8cqEm6gXpGnH&_nc_rml=0&_nc_ht=video.fdps6-1.fna&oh=20fa6e5b4055054ad18e765f75a70b31&oe=616E7F83`,
      images: ["image1", "image2"],
      username: creatorUsername,
      post_id: "12396958329",
      user_id: "12391350",
      url: "https://url.com/bla",
      importers: ["importerUsername"],
      metrics: {
        likes: 3,
        comments: 5,
        shares: 6
      }
    }
    console.log("GUN USER", await gun.user());
    // while (!gun.user().is) {
    //   sleep(2000);
    // }
    new FacebookService().savePostToGun(urlId, post);
    await sleep(3000)
    const savedGunData = await gun.user().get(creatorUsername).get(urlId);
    expect(typeof savedGunData).toBe("string");
    expect(savedGunData.length).toBeGreaterThan(0);
  });
});

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
// describe('Save FBPost to GunDB')