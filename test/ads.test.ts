import {AdRecord} from "../records/ad.record";
import {pool} from "../utils/db";

afterAll(async ()=>{
  await pool.end();
});

const defaultObj = {
  name: 'Test',
  description: 'Testowy opis',
  lat: 9,
  lon: 9,
  price: 0,
  url: "https://megak.pl",
}

test('AdRecord returns data from database for one entry', async () => {
  const ad = await AdRecord.getOne('abc');
  expect(ad).toBeDefined();
  expect(ad.id).toBe('abc');
  expect(ad.name).toBe('Testa')
})
test('AdRecord.getOne returns null from database for unexisting entrty.', async () => {
  const ad = await AdRecord.getOne('asc');
  expect(ad).toBeNull();
});

test('AdRecord.findAll returns array of found entries', async () => {
  const ad = await AdRecord.findAll('');
  expect(ad).not.toEqual([]);
  expect(ad[0].id).toBeDefined();
});
test('AdRecord.findAll returns array of found entries when searching for "a"', async () => {
  const ad = await AdRecord.findAll('a');
  expect(ad).not.toEqual([]);
  expect(ad[0].id).toBeDefined();
})
test('AdRecord.findAll returns empty array of found entries when srarching for "x"', async () => {
  const ad = await AdRecord.findAll('x');
  expect(ad).toStrictEqual([]);
})

test('AdRecord.insert returns new UUID', async () => {
  const ad = new AdRecord(defaultObj);
  await ad.insert();
  expect(ad.id).toBeDefined();
  expect(typeof ad.id). toBe('string');
})
test('AdRecord.insert inserts data to database', async () => {

  const ad = new AdRecord(defaultObj);
  await ad.insert();

  const foundAd = await AdRecord.getOne(ad.id);
  expect(foundAd).toBeDefined();
  expect(foundAd).not.toBeNull();
  expect(foundAd.id).toBe(ad.id);
})
