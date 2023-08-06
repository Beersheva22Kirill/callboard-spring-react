package spring.callboard.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import spring.callboard.model.CallBoardDataObject;
import spring.callboard.service.Board;

@RestController
@RequestMapping("board")
@Slf4j
@RequiredArgsConstructor
@Validated
@CrossOrigin
public class CallBoardController {
	private static final String FILE_NAME = "./db/adv.data";
	final Board service;
	
	@PostMapping
	Integer addToCallBoard(@RequestBody @Valid CallBoardDataObject object) {
		log.debug("Controller recieved object " + object);
		Integer id = service.addFromClient(object);
		return id;
	}
	
	@GetMapping
	List<CallBoardDataObject> getAll(){
		
		return service.getAll();
	}
	
	@GetMapping("category/{categoryName}")
	List<CallBoardDataObject> getByCategory(@PathVariable(name = "categoryName") String category){
		
		return service.getByCategory(category);
	}
	
	@GetMapping("category")
	List<CallBoardDataObject> getByCategoryParam(@RequestParam(name = "category", defaultValue = "") @NotEmpty String category){
		
		return service.getByCategory(category);
	}
	
	@GetMapping("price")
	List<CallBoardDataObject> getByPrice(
			@RequestParam(name = "price") Float price,
			@RequestParam(name = "before", defaultValue = "true") boolean before){
		
		return service.getByPrice(price, before);
	}
	
	@GetMapping("{id}")
	public CallBoardDataObject getById(@PathVariable(name = "id") Integer id) {
		return service.getById(id);
	}
	
	@DeleteMapping("{id}")
	public CallBoardDataObject removeById(@PathVariable(name = "id") Integer id) {
		log.debug("Controller received for removing id: " + id);
		return service.removeAdvert(id);
	}
	
	@PutMapping("{id}")
	public CallBoardDataObject updateAdvert(
			@PathVariable(name = "id") Integer id, 
			@RequestBody CallBoardDataObject newObject) {
		
		return service.updateAdvert(id, newObject);
	}
	
	@PostConstruct
	void restore() {
		service.restore(FILE_NAME);
	}
	
	@PreDestroy
	void save() {
		service.save(FILE_NAME);
	}

}
