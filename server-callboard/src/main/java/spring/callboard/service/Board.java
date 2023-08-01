package spring.callboard.service;

import java.io.Serializable;
import java.util.List;

import spring.callboard.model.CallBoardDataObject;

public interface Board extends Serializable{
	
	Integer addFromClient(CallBoardDataObject object);
	List<CallBoardDataObject> getAll();
	List<CallBoardDataObject> getByCategory(String category);
	List<CallBoardDataObject> getByPrice(Float price,boolean before);
	CallBoardDataObject getById(Integer id);
	CallBoardDataObject removeAdvert(Integer id);
	CallBoardDataObject updateAdvert(Integer id, CallBoardDataObject newAdvert);
	void addFromFile(CallBoardDataObject object);
	void save(String path);
	void restore(String path);

}
