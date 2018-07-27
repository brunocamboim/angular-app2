import { Component, OnInit } from '@angular/core';
import { OfertasService } from '../ofertas.service'
import { Observable, Subject } from '../../../node_modules/rxjs';
import { Oferta } from '../shared/oferta.model';
import { switchMap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { of } from 'rxjs'

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css'],
  providers: [ OfertasService ]
})
export class TopoComponent implements OnInit {

  public ofertas: Observable<Oferta[]>
  private subjectPesquisa: Subject<string> = new Subject<string>()

  constructor(private ofertasService: OfertasService) { }

  ngOnInit() {
    //switch map cancela requisicoes anteriores, que forem chamados consecutivamente
    //SUBSCRIBE pode ser incializado no onInit pois ele ficará 'escutando' as alterações
    this.ofertas = this.subjectPesquisa //retorno oferta[]
      .pipe(
        debounceTime(500), //executa a acao após 1 seg
        distinctUntilChanged(), //para fazer apenas pesquisas distintas(diferente da pesquisa anterior)
        switchMap((termo: string) => { 
          if(termo.trim() === "") {
            //retornar um observable se array de ofertas vazio
            return of<Oferta[]>([])
          }
          return this.ofertasService.pesquisaOfertas(termo)
        }),
        catchError((err: any) => {
          return of<Oferta[]>([])
        })
      )
    
    
  }

  public pesquisa(termoDaBusca: string): void {
    //USO COM SUBJECT ()
    this.subjectPesquisa.next(termoDaBusca)
  }

  public limpaPesquisa(): void {
    this.subjectPesquisa.next('')
  }

}
