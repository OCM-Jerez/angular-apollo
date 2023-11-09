import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';

const GET_ORG_DETAILS = gql`
query MyQuery {
  allOrgProvisionProcedures {
    id
  }
  allOrgDepartments {
    category {
      id
      name
    }
  }
}
`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  provisionProcedures: any[] | null = null;
  departments: any[] | null = null;
  loading: boolean = true;
  error: any = null;
  private querySubscription: Subscription | null = null;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.querySubscription = this.apollo.watchQuery({
      query: GET_ORG_DETAILS
    }).valueChanges.subscribe((result: any) => {
      const { data, loading, errors } = result;
      console.log('data', result);
      
      this.loading = loading;
      if (errors) {
        this.error = errors;
        this.loading = false; // Asegúrate de establecer loading a false aquí también
      } else {
        this.provisionProcedures = data.allOrgProvisionProcedures;
        this.departments = data.allOrgDepartments;
        this.error = null;
        this.loading = false; // Asegúrate de establecer loading a false una vez que los datos están cargados
      }
    }, (error) => {
      this.loading = false;
      this.error = error;
    });
  }

  ngOnDestroy() {
    this.querySubscription?.unsubscribe();
  }
}
