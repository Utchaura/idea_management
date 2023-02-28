import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterIdea'
})
export class FilterIdeaPipe implements PipeTransform {

  transform(value: any, filterString: string): any {

    if(value === undefined && filterString === ''){
        return value;
    }

    const ideas = [];
    for(const idea of value){
      if(idea.statement.toLocaleLowerCase().includes(filterString.toLocaleLowerCase()) || idea.description.toLocaleLowerCase().includes(filterString.toLocaleLowerCase())){
        ideas.push(idea);
      }
    }
    return ideas;
  }

}
