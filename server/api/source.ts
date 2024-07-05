import { getInfo, normalizeHeaders } from "./global.js";

type VideoItem = {
  type: "video";
  bvid: string;
  title: string;
  description: string;
  arcrank: string;
  pic: string;
  play: number;
  video_review: number;
  favorites: number;
  tag: string;
  review: number;
  pubdate: number;
  senddate: number;
  duration: string;
  badgepay: boolean;
  hit_columns: string[];
  view_type: string;
  is_pay: number;
  is_union_video: number;
  rec_tags: any[];
  new_rec_tags: string[];
  rank_score: number;
  like: number;
  upic: string;
  corner: string;
  cover: string;
  desc: string;
  url: string;
  rec_reason: string;
  danmaku: number;
  biz_data: any;
  is_charge_video: number;
  vt: number;
  enable_vt: number;
  vt_display: string;
  subtitle: string;
  episode_count_text: string;
  release_status: number;
  is_intervene: number;
  area: number;
  style: number;
  cate_name: string;
  is_live_room_inline: number;
  live_status: number;
  live_time: string;
  online: number;
  rank_index: number;
  rank_offset: number;
  roomid: number;
  short_id: number;
  spread_id: number;
  tags: string;
  uface: string;
  uid: number;
  uname: string;
  user_cover: string;
  parent_area_id: number;
  parent_area_name: string;
  watched_show: any;
};
type SearchResponse = {
  code: number;
  message: string;
  data: {
    page: number;
    pagesize: number;
    numResults: number;
    numPages: number;
    result: VideoItem[];
  };
};

const joiner = "_";

export const search = async (source: string, keyword: string) => {
  if (source === "bilibili") {
    const videos: SearchResponse = await fetch(
      "https://api.bilibili.com/x/web-interface/search/type?" +
        new URLSearchParams({
          search_type: "video",
          keyword,
          order: "totalrank",
          duration: "0",
          tids: "0",
          page: "1",
        }),
      {
        headers: {
          cookie: "SESSDATA=xxx",
        },
      }
    ).then((res) => res.json());
    type VideoData = {
      code: number;
      message: string;
      data?: Array<VideoItem>;
    };

    type VideoItem = {
      cid: number;
      part: string;
    };

    return (
      await Promise.all(
        videos.data.result
          .filter((v) => v.type === "video")
          .map(async (v) => {
            console.log(v.bvid);
            const pagelist: VideoData = await fetch(
              "http://api.bilibili.com/x/player/pagelist?" +
                new URLSearchParams({
                  bvid: v.bvid,
                })
            ).then((r) => r.json());

            return (pagelist.data ?? []).map((p) => {
              return {
                code: `bilibili${joiner}${v.bvid}${joiner}${p.cid}`,
                name: `${v.title}#${p.part}`,
                author: v.author,
              };
            });
          })
      )
    ).flat();
  } else {
    throw "Unsupport";
  }
};

export const getAudio = async (code: string): Promise<unknown> => {
  const info = getInfo();
  const [_, bvid, cid] = code.split(joiner);
  const ret = await fetch(
    "https://api.bilibili.com/x/player/playurl?" +
      new URLSearchParams({
        bvid,
        cid,
        fnval: "16",
      })
  ).then((r) => r.json());
  const audioUrl = ret.data.dash.audio[0].baseUrl;
  const audio = await fetch(audioUrl, {
    headers: {
      referer: "https://www.bilibili.com",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36 Edg/88.0.705.68",
    },
  });
  info.statusCode = audio.status;
  info.responseHeaders = {
    ...normalizeHeaders(Object.fromEntries(audio.headers.entries())),
  };
  return audio.body;
};

export const _getDetial = async (code: string) => {
  const [_, bvid, cid] = code.split(joiner);
  const res = (await fetch(
    "https://api.bilibili.com/x/web-interface/view?" +
      new URLSearchParams({
        bvid,
      })
  ).then((r) => {
    console.log(bvid);
    console.log(r.status);
    return r.json();
  })) as {
    data: {
      title: string;
      pic: string;
      owner: {
        name: string;
      };
      pages: {
        cid: number;
        part: string;
      }[];
    };
  };
  console.log(res.data.pages);
  const page = res.data.pages.find((p) => p.cid.toString() === cid);
  if (!page) {
    throw `Part ${cid} of ${bvid} is not found!`;
  }
  return {
    title: res.data.title + "#" + page.part,
    pic: res.data.pic,
    author: res.data.owner.name,
  };
};

export const getImage = async (code: string): Promise<unknown> => {
  const info = getInfo();
  const d = await _getDetial(code);
  const audio = await fetch(d.pic);
  info.statusCode = audio.status;
  info.responseHeaders = {
    ...normalizeHeaders(Object.fromEntries(audio.headers.entries())),
  };
  return audio.body;
};
