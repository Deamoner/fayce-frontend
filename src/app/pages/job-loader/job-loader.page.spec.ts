import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JobLoaderPage } from './job-loader.page';

describe( 'JobLoaderPage', () => {
    let component : JobLoaderPage;
    let fixture : ComponentFixture<JobLoaderPage>;

    beforeEach( waitForAsync( () => {
        TestBed.configureTestingModule( {
            declarations: [ JobLoaderPage ],
            imports: [ IonicModule.forRoot() ],
        } ).compileComponents();

        fixture = TestBed.createComponent( JobLoaderPage );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } ) );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
