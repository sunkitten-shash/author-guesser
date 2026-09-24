import { load } from 'cheerio';
import makeFetchCookie from 'fetch-cookie';
import parse, { HTMLElement } from 'node-html-parser';

// ao3 login code from ao3.js pr https://github.com/FujoWebDev/AO3.js/issues/60
const AO3_LOGIN_URL = 'https://archiveofourown.org/users/login';
const AO3_SESSION_COOKIE = '_otwarchive_session';

const cookieJar = new makeFetchCookie.toughCookie.CookieJar();
const fetchCookie = makeFetchCookie(fetch, cookieJar);

export default function loginFetcher() {
  return async (...params: Parameters<typeof fetch>) => {
    const username = process.env.AO3_USERNAME;
    const password = process.env.AO3_PWD;
    if (!username || !password)
      throw new Error('username or password not available');
    const url = getUrl(params[0]);
    const session = (await cookieJar.getCookies(url)).find(
      (cookie) => cookie.key === AO3_SESSION_COOKIE,
    );
    if (!session || (session.expires && session.expires <= new Date()))
      await login(username, password);
    return await fetchCookie(...params);
  };
}

async function login(username: string, password: string): Promise<void> {
  const loginForm = await fetchCookie(AO3_LOGIN_URL);
  const token = getAuthenticityToken(parse(await loginForm.text()));
  if (!token) throw new Error('Could not find authenticity token');
  const payload = getLoginPayload(username, password, token);
  const body = new URLSearchParams(payload).toString();
  await fetchCookie(AO3_LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': body.length.toString(),
    },
    body,
  });
}

function getAuthenticityToken(element: HTMLElement): string | undefined {
  return element
    .querySelector('form.new_user')
    ?.querySelectorAll('input')
    ?.find((x) => x.getAttribute('name') == 'authenticity_token')
    ?.getAttribute('value');
}

function getLoginPayload(username: string, password: string, token: string) {
  const payload = {
    authenticity_token: token,
    'user[login]': username,
    'user[password]': password,
    commit: 'Log+in',
  };
  return payload;
}

function getUrl(requestInfo: RequestInfo | URL): URL {
  return typeof requestInfo === 'string'
    ? new URL(requestInfo)
    : requestInfo instanceof URL
      ? requestInfo
      : new URL(requestInfo.url);
}

const fetchWork = async (workUrl: string) => {
  let fetcher = fetch;
  let result = await fetcher(workUrl);
  let text = await result.text();
  if (
    text.includes(
      'This work is only available to registered users of the Archive',
    )
  ) {
    console.log('Work is locked, logging in...');
    fetcher = loginFetcher();
    result = await fetcher(workUrl);
    console.log('Fetched work');
    text = await result.text();
  }
  return text;
};

export const fetchWorkMetadata = async (workUrl: string, logging = false) => {
  const text = await fetchWork(workUrl);

  const $ = load(text);
  // we need wordcount and some summary info? like we can determine blockquotes at least

  const title = $('h2.title.heading').text().trim();

  const meta = $('dl.work.meta.group');

  // TODO: add fandom if you work on a multifandom fest lol

  // TODO: replace w/ just one letter
  const ratingList = meta.find('dd.rating.tags').find('.tag').toArray();
  let rating = ratingList.map((rating) => $(rating).text()).join(', ');
  rating = rating.replace('Teen And Up Audiences', 'Teen');
  rating = rating.replace('General Audiences', 'Gen');

  // category only needed if it's poly/r63
  const category = meta.find('dd.category.tags').find('a').text();

  // ohhh we need relationship mapping
  const relationshipList = meta
    .find('dd.relationship.tags')
    .find('.tag')
    .toArray()
    .map((relationship) => $(relationship).text());

  const wordcount = parseInt(meta.find('dd.words').text().replace(',', ''));

  const chapters = meta.find('dd.chapters').text();
  let chapterCountStr = chapters.split('/')[1];
  if (chapterCountStr === '?') {
    chapterCountStr = chapters.split('/')[0];
  }
  const chapterCount = parseInt(chapterCountStr);
  let chaptered = false;
  if (chapterCount > 1) {
    chaptered = true;
  }

  const metadata = {
    title,
    rating,
    category,
    relationshipList,
    wordcount,
    chapterCount,
    chaptered,
  };

  if (logging) console.log(metadata);

  return metadata as FicMetadata;
};
