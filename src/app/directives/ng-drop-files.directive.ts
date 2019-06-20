import { FileItem } from '../models/file-item';
import { Directive, EventEmitter, ElementRef,
        HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter( event: any ) {
    this.mouseSobre.emit( true );
    this._prevenirDetener( event );
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave( event: any ) {
    this.mouseSobre.emit( false );
  }

  @HostListener('drop', ['$event'])
  public onDrop( event: any ) {
    const tranferencia = this._getTransferencia( event );
    if ( !tranferencia ) {
      return;
    }

    this._exraerArchivos( tranferencia.files );
    this._prevenirDetener( event );

    this.mouseSobre.emit( false );
  }

  private _getTransferencia( event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransefer;
  }

  private _exraerArchivos( archivosLista: FileList ) {
    // tslint:disable-next-line: forin
    for ( const propiedad in Object.getOwnPropertyNames( archivosLista ) ) {
      const archivoTemp = archivosLista[propiedad];
      if ( this._archivoPuedeSerCargado( archivoTemp ) ) {
        const nuevoArchivo = new FileItem( archivoTemp );
        this.archivos.push(nuevoArchivo);
      }
    }
  }

  // Validaciones
  private _archivoPuedeSerCargado( archivo: File ): boolean {
    if (!this._archivoDroppeado( archivo.name ) && this._esImagen( archivo.type )) {
      return true;
    } else {
      return false;
    }
  }

  private _prevenirDetener( event ) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoDroppeado( nombreArchivo: string ): boolean {
    for ( const archivo of this.archivos ) {
      if ( archivo.nombreArchivo === nombreArchivo ) {
        console.log('El archivo ', nombreArchivo + ' ya existe');
        return true;
      }
    }
    return false;
  }

  private _esImagen( tipoArchivo: string ): boolean {
    return ( tipoArchivo === '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('image');
  }
}
