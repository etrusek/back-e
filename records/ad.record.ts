import {AdEntity, AdRecordResults, NewAdEntity, SimpleAdEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {v4 as uuid} from 'uuid';

export class AdRecord implements AdEntity {
  public id: string;
  public name: string;
  public description: string;
  public price: number;
  public url: string;
  public lat: number;
  public lon: number;

  constructor(obj: NewAdEntity) {
    if (!obj.name || obj.name.length > 100) {
      throw new ValidationError('Nazwa ogłoszenia nie może być pusta ani przekraczać 100 znaków.');
    }
    if (obj.description.length > 1024) {
      throw new ValidationError('Treść ogłoszeia nie może przekraczać 1024 znaków.');
    }
    if (obj.price < 0 || obj.price > 9999999) {
      throw new ValidationError('Cena ogłoszenia nie może być ujemna ani większa niż 9 999 999zł.');
    }
    if (!obj.url || obj.url.length > 100) {
      throw new ValidationError('Adres ogłoszenia nie może być pusty ani przekraczać 100 znaków.');
    }
    if (typeof obj.lat !== "number" || typeof obj.lon !== "number") {
      throw new ValidationError('Nie można zlokalizować ogłoszenia.')
    }

    this.id = obj.id;
    this.name = obj.name;
    this.description = obj.description;
    this.price = obj.price;
    this.url = obj.url;
    this.lat = obj.lat;
    this.lon = obj.lon;
  }

  static async getOne(id: string): Promise<AdRecord | null> {
    const [results] = await pool.execute("SELECT * FROM `ev` WHERE id =  :id", {
      id,
    }) as AdRecordResults;
    return results.length === 0 ? null : new AdRecord(results[0]);
  }

  static async findAll(name: string): Promise<SimpleAdEntity[] | null> {
    const [results] = await pool.execute("SELECT * FROM `ev` WHERE name LIKE  :search", {
      search: `%${name === null ? "" : name}%`,
    }) as AdRecordResults;
    return results.length > 0 ? results.map(result => {
      const {id, lat, lon} = result;
      return {
        id, lat, lon
      }
    }) : [];
  }

  async insert(): Promise<void> {
    if (!this.id) {
      this.id = uuid();
    } else {
      throw new Error('cannot insert something that is already inserted')
    }
    await pool.execute("INSERT INTO `ev`(`id`,`name`,`description`, `price`,`url`, `lat`, `lon`) VALUES(:id, :name, :description, :price,:url,:lat,:lon)", this);
  }
}
