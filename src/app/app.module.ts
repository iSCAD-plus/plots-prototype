import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import 'd3';
import 'nvd3';
import { NvD3Module } from 'ng2-nvd3';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PlotComponent } from './shared';
import { routing, appRoutingProviders } from './app.routes';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    // uri: 'http://iscad.unmeetings.org/api/graphql'
    uri: 'http://localhost:3000/api/graphql'
  }),
});

export function provideClient(): ApolloClient {
  return client;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlotComponent,
  ],
  imports: [
    NvD3Module,
    BrowserModule,
    ApolloModule.forRoot(provideClient),
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
