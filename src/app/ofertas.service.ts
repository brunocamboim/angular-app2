import { Http, Response } from '@angular/http'
import { Injectable } from '@angular/core'
import { Oferta } from './shared/oferta.model'

import { URL_API } from './app.api'
import { Observable } from '../../node_modules/rxjs';
import { map, retry } from 'rxjs/operators';

@Injectable()
export class OfertasService {

    constructor(private http:Http) {}

    public getOfertas(): Promise<Oferta[]> {
        //efetuar um requisição http e retornar uma promisse Oferta[]
        return this.http.get(`${URL_API}/ofertas?destaque=true`)
            .toPromise()
            .then((resposta: Response) => resposta.json())
    }

    public getOfertasPorCategoria(categoria: string): Promise<Oferta[]> {
        return this.http.get(`${URL_API}/ofertas?categoria=${categoria}`)
            .toPromise()
            .then((resposta: Response) => resposta.json())
    }

    public getOfertaPorId(id: number): Promise<Oferta> {
        return this.http.get(`${URL_API}/ofertas?id=${id}`)
            .toPromise()
            .then((resposta: Response) => {
                return resposta.json().shift()
            })
    }

    public getComoUsarOfertaPorId(id: number): Promise<String> {
        return this.http.get(`${URL_API}/como-usar?id=${id}`)
        .toPromise()
        .then(( resposta: Response) => {
            return resposta.json()[0].descricao
        })
    }

    public getOndeFicaOfertaPorId(id: number): Promise<String> {
        return this.http.get(`${URL_API}/onde-fica?id=${id}`)
        .toPromise()
        .then(( resposta: Response) => {
            return resposta.json()[0].descricao
        })
    }

    public pesquisaOfertas(termo: String): Observable<Oferta[]> {
        return this.http.get(`${URL_API}/ofertas?descricao_oferta_like=${termo}`)
            .pipe(map((resposta: Response) => resposta.json()), retry(10))
    }
}