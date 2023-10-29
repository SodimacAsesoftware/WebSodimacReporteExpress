import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-reporte-express',
  templateUrl: './reporte-express.component.html',
  styleUrls: ['./reporte-express.component.scss'],
})
export class ReporteExpressComponent implements OnInit {
  public resultado: any[] = [];
  public queryForm!: FormGroup;
  public blockedDocument: boolean = false;
  public isDisabledDivAtrr: boolean = true;
  public lineNumbers: number[] = [];
  tipoConsultaSeleccionada: string = 'Selecciona una opcion';
  textQuery: string = '';
  opcionSeleccionada = new FormControl('');
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  tipoConsulta: { label: string; value: string }[] = [
    { label: 'Selecciona una opcion', value: 'Selecciona una opcion' },
    {
      label: 'Consulta tabla 1 aborrar_78',
      value: 'select * from aborrar_78',
    },
    {
      label: 'Consulta tabla 2 aborrar_78_2',
      value: 'select * from aborrar_78_2',
    },
    {
      label: 'Consulta invaudee',
      value: `select 
      a.audit_number,
      c.org_lvl_number, 
      c.org_name_full,
      b.prd_lvl_number, 
      b.prd_name_full,
      a.trans_date,
      a.trans_trn_code,
      d.inv_drpt_desc, 
      a.trans_ref, 
      a.trans_ref2,
      a.inv_eff_ret,
      a.inv_eff_bal,
      a.trans_type_code,
      a.inv_drpt_code,
      (a.trans_qty) as qty,
      (a.trans_ext_cost) as Costo,
      (a.trans_ext_retl) as Venta,
      (a.trans_ext_vat) as IVA, 
      a.trans_session,
      a.reslt_oh_qty, 
      a.reslt_oh_cost
   from uniprod.invaudee a, uniprod.prdmstee b, uniprod.orgmstee c, uniprod.invtrdee d
   where a.trans_prd_child = b.prd_lvl_child
   and a.trans_org_child = c.org_lvl_child
   and a.trans_date between '01-09-2023' and '30-09-2023'
   and a.inv_mrpt_code in ('SS')
   and a.trans_type_code = d.inv_type_code
   and a.trans_trn_code = d.inv_trn_code`,
    },
  ];

  constructor(private fb: FormBuilder) {
    this.queryForm = this.fb.group({
      tipoConsultaSeleccionada: this.opcionSeleccionada,
      textQuery: this.textQuery,
      numeroProducto: ['', []],
      numeroTienda: ['', []],
      fechaInicio: ['', []],
      fechaFin: ['', []],
    });
  }

  ngOnInit(): void {
    this.crearFormulario();
  }
  private crearFormulario(): void {}
  exportarExcel() {
    if (this.resultado.length > 0) {
      // Convierte los datos a formato CSV usando papaparse
      const csvData = Papa.unparse(this.resultado);

      // Crea un Blob con los datos CSV y el tipo de archivo
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

      // Crea una URL para el Blob
      const url = window.URL.createObjectURL(blob);

      // Crea un enlace (link) para descargar el archivo CSV
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'datos.csv'); // Nombre del archivo CSV

      // Simula un clic en el enlace para descargar el archivo
      link.click();

      // Libera la URL del Blob
      window.URL.revokeObjectURL(url);
    }
  }
  chkAtrrchanged(evt: any, div: number) {
    if (evt.checked) {
      switch (div) {
        case 0:
          this.isDisabledDivAtrr = false;
          break;
      }
    } else {
      switch (div) {
        case 0:
          this.isDisabledDivAtrr = true;
          break;
      }
    }
  }
  updateLineNumbers() {
    const lines = this.textQuery.split('\n');
    this.lineNumbers = Array.from(
      { length: lines.length },
      (_, index) => index + 1
    );
  }
  // seleccionarOpcion(opcion: string) {
  //   console.log('hola munco criuel');
  //   const seleccion = this.tipoConsulta.find((item) => item.value === opcion);
  //   if (seleccion) {
  //     // Establece el textoQuery con la opción seleccionada
  //     this.queryForm.controls['textQuery'].setValue(seleccion.value);
  //     this.updateLineNumbers();
  //   }
  // }
  seleccionarOpcion(opcion: string) {
    // Encuentra la opción seleccionada en el arreglo tipoConsulta
    console.log('hola', opcion);
    const seleccion = this.tipoConsulta.find((item) => item.value === opcion);
    if (seleccion) {
      // Establece el textoQuery con la opción seleccionada
      this.textQuery = seleccion.value;
      this.updateLineNumbers();
    }
  }
  obtenerNombresColumnas(objeto: any): string[] {
    return Object.keys(objeto);
  }
}
